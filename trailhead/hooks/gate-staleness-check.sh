#!/bin/bash
# Stop hook: catch a status claim the gate does not support.
#
# Fires when Claude stops responding, and blocks (exit 2) only when the project has made
# an OBSERVABLE CLAIM it cannot back:
#
#   1. a status word outside the vocabulary in the deliverable table, or
#   2. a `verified`/`accepted` row while the last gate run was not a full green, or
#   3. a `verified`/`accepted` row while the last gate run predates the current tree.
#
# Check 3 is the one that matters most and was missing at first: without it, "the last run
# was green" reads as "the current tree is green", and a green receipt survives every edit
# made after it.
#
# What this deliberately does NOT do is fire on activity. A Stop hook that triggers on
# commit-message keywords fires during ordinary exploration, gets disabled within a day,
# and takes the real enforcement with it.
#
# Escape hatch: `.gates/pause`. An escape hatch you designed beats one the user builds by
# deleting your hook.
#
# This is a convenience, not the gate. `node scripts/gate.mjs` is the gate, and it runs
# identically under Codex, Gemini, a bare terminal, and CI. Nothing here is load-bearing.

set -u

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-}"
[ -n "$PROJECT_DIR" ] || exit 0
[ -f "$PROJECT_DIR/gate.config.json" ] || exit 0
[ -f "$PROJECT_DIR/.gates/pause" ] && exit 0

STATE_FILE="$PROJECT_DIR/.planning/STATE.md"
[ -f "$STATE_FILE" ] || exit 0

# Deliverable-table rows only. Leading whitespace is allowed — an indented table is still
# a table, and `status-lint` trims. The `>= 5 pipes` filter is the discriminator: a
# deliverable row has at least four cells, while an unrelated two-column table elsewhere
# in the file (`| Deployment | complete |`) has three pipes and is not a status claim.
# This hook is a convenience; `status-lint` does the real vocabulary check with a proper
# header-aware parse. Nuisance failures here would get the hook deleted, which would take
# the freshness check below with it.
TABLE_ROWS="$(grep -E '^[[:space:]]*\|' "$STATE_FILE" 2>/dev/null \
  | grep -Ev '^[[:space:]]*\|[[:space:]]*-' \
  | awk -F'|' 'NF >= 5' || true)"
[ -n "$TABLE_ROWS" ] || exit 0

# Match a banned word only where a status CELL begins with it — `| implemented |` or
# `| **implemented** (evidence/d4) |`. Matching anywhere in the row would fire on a
# deliverable named "Export complete flow", and a hook with nuisance failures gets deleted.
BANNED="$(printf '%s' "$TABLE_ROWS" | grep -inE '\|[[:space:]]*\*{0,2}(implemented|done|completed|complete|finished|shipped|in progress|wip)\b' | head -3 || true)"
if [ -n "$BANNED" ]; then
  {
    echo "STATUS CHECK: .planning/STATE.md uses a status word that is not in the vocabulary."
    echo "Use not started, built, verified, or accepted — see AGENTS.md. Offending row(s):"
    printf '%s\n' "$BANNED"
  } >&2
  exit 2
fi

CLAIMS="$(printf '%s' "$TABLE_ROWS" | grep -icE '\|[[:space:]]*\*{0,2}(verified|accepted)\b' || true)"
[ "${CLAIMS:-0}" -gt 0 ] || exit 0

RECEIPT="$PROJECT_DIR/.gates/last-run.json"
if [ ! -f "$RECEIPT" ]; then
  echo "STATUS CHECK: .planning/STATE.md claims $CLAIMS deliverable(s) verified or accepted, but the gate has never run here. Run: node scripts/gate.mjs" >&2
  exit 2
fi

# Deliberately not jq — a hook that hard-depends on a tool the user may not have is a hook
# that fails in a way nobody understands.
RESULT="$(grep -o '"result"[[:space:]]*:[[:space:]]*"[a-z_]*"' "$RECEIPT" | head -1 | sed 's/.*"\([a-z_]*\)"$/\1/')"

# Only a full green supports the claim. `advisory` means something reporting is red, which
# for a `verified` claim usually means the QA that the word is defined by did not pass.
if [ "$RESULT" != "pass" ]; then
  case "$RESULT" in
    partial) WHY="was a single stage (--stage), which cannot support a whole-deliverable claim" ;;
    advisory) WHY="was 'advisory' — blocking stages passed but something reporting is red" ;;
    paused) WHY="was suspended by .gates/pause" ;;
    *) WHY="was '${RESULT:-unreadable}'" ;;
  esac
  echo "STATUS CHECK: .planning/STATE.md claims $CLAIMS deliverable(s) verified or accepted, but the last gate run $WHY. Fix it, record a deferral, or downgrade the claim to 'built'. Run: node scripts/gate.mjs" >&2
  exit 2
fi

# Freshness. A green receipt describes the tree as it was when it was written; anything
# edited since is uncovered by it.
NEWER="$(find "$PROJECT_DIR" \
  -name node_modules -prune -o -name .git -prune -o -name .gates -prune -o -name dist -prune -o -name build -prune -o \
  -type f -newer "$RECEIPT" -print -quit 2>/dev/null || true)"
if [ -n "$NEWER" ]; then
  REL="${NEWER#"$PROJECT_DIR"/}"
  echo "STATUS CHECK: .planning/STATE.md claims $CLAIMS deliverable(s) verified or accepted, but files have changed since the last gate run (e.g. $REL). That receipt does not describe the current tree. Re-run: node scripts/gate.mjs" >&2
  exit 2
fi

exit 0
