# Trailhead — deployment config

<!-- Installed into YOUR project by /trailhead:init. This is per-deployment configuration,
     not agent guidance — the agent contract this plugin writes is AGENTS.md at your repo
     root, and the gate's own configuration is gate.config.json. Most of what trailhead
     needs is detected or asked once during init; only these two knobs live here. -->

## Configuration

- **stage_level:** [prototype | pilot | production]

  How far along this project is. Drives which gate failures block and which only report,
  via the rule *gate what you cannot undo, report what you can*. `prototype` blocks only
  on irreversible failures — a credential in the tree, an overdue architecture decision.
  Raising this is a decision you take deliberately, and the run after you raise it will
  be red. This mirrors `stage_level` in `gate.config.json`, which is the value the runner
  actually reads.

- **contract_line_cap:** [default 300]

  The line budget for `contracts/CONTRACT.md`. Past this, nobody reads it, and an unread
  contract is worse than none — it gives the appearance of governance while providing
  none. If yours is growing, it is usually state or rationale trying to live there.
