#!/bin/bash
# PreToolUse hook: refuse a commit carrying credential material.
#
# Guards the one failure that cannot be taken back: a failing test is fixable on your own
# schedule, a key that reaches a remote is rotated, not undone.
#
# It checks the STAGED BLOB, not the working-tree file — what git is about to record is the
# only thing worth checking. Staging a key and then cleaning the file on disk must not get
# through.
#
# **It does not carry its own pattern table.** When the project has the gate installed it
# shells out to `scripts/checks/secrets.mjs --staged`, so there is exactly one detector.
# Two tables in two languages drift: a staged OpenAI-shaped key once passed this hook and
# failed the gate, which teaches people that one of the two is lying. The inline fallback
# below runs only when the project has no gate at all, and says so.
#
# Scoped to `git commit` by reading the tool call off stdin. A bare `Bash` matcher would
# re-scan the index on every shell call the agent makes.
#
# Never prints a matched value.

set -u

INPUT="$(cat 2>/dev/null || true)"

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-}"
[ -n "$PROJECT_DIR" ] || exit 0

# A linked worktree has `.git` as a FILE, not a directory.
[ -e "$PROJECT_DIR/.git" ] || git -C "$PROJECT_DIR" rev-parse --git-dir >/dev/null 2>&1 || exit 0

if command -v jq >/dev/null 2>&1; then
  COMMAND="$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)"
else
  COMMAND="$INPUT"
fi
[ -n "$COMMAND" ] || exit 0

printf '%s' "$COMMAND" \
  | grep -Eq '(^|[;&|]|[[:space:]])git([[:space:]]+-[^[:space:]]+([[:space:]]+[^[:space:]]+)?)*[[:space:]]+commit([[:space:]]|$)' \
  || exit 0

# --- preferred path: the project's own detector, so there is only one -------------------
DETECTOR="$PROJECT_DIR/scripts/checks/secrets.mjs"
if [ -f "$DETECTOR" ] && command -v node >/dev/null 2>&1; then
  ( cd "$PROJECT_DIR" && node "$DETECTOR" --staged )
  RC=$?
  [ "$RC" -eq 2 ] && exit 2
  exit 0
fi

# --- fallback: no gate installed here ---------------------------------------------------
# Deliberately narrower than the gate's table, and it says so, so nobody mistakes a pass
# here for the gate's verdict.
PATTERN='(sk_live_[A-Za-z0-9]{16,}|sk_test_[A-Za-z0-9]{16,}|(AKIA|ASIA)[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,}|glpat-[A-Za-z0-9_-]{20,}|xox[bpoasr]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35}|sk-ant-[A-Za-z0-9_-]{24,}|sk-(proj-)?[A-Za-z0-9_-]{32,}|-----BEGIN (RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----)'
PLACEHOLDER='(EXAMPLE|PLACEHOLDER|YOUR[_-]|XXXX|\.\.\.)'

FOUND=0
while IFS= read -r -d '' file; do
  [ -n "$file" ] || continue
  BLOB="$(git -C "$PROJECT_DIR" show ":$file" 2>/dev/null)" || continue
  [ -n "$BLOB" ] || continue
  if printf '%s' "$BLOB" | grep -aEo "$PATTERN" 2>/dev/null | grep -Evq "$PLACEHOLDER"; then
    echo "SECRETS CHECK: possible credential in the STAGED content of $file" >&2
    FOUND=1
  fi
done < <(git -C "$PROJECT_DIR" diff --cached --name-only -z 2>/dev/null)

if [ "$FOUND" -eq 1 ]; then
  echo "SECRETS CHECK FAILED (fallback scan — this project has no scripts/checks/secrets.mjs, so this is a narrower check than the gate's). Unstage it, remove the credential, or move the value into environment-specific secret management. Do not paste it into chat." >&2
  exit 2
fi
exit 0
