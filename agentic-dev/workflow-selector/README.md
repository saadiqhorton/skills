# workflow-selector

A Claude Code skill that classifies a freeform task into the right **dynamic workflow** pattern and hands back a copy-paste prompt + JS template.

Source: Thariq's "A harness for every task" article (Jun 2 2026) + the official [Claude Code workflows docs](https://code.claude.com/docs/en/workflows).

## Install

```bash
# Project-local (default) → ./<agent>/skills/
npx skills add saadiqhorton/skills@workflow-selector

# Global → ~/<agent>/skills/
npx skills add saadiqhorton/skills@workflow-selector -g

# optional: verify structure (adjust path for agent + scope)
python3 .claude/skills/workflow-selector/scripts/validate.py
```

## Use

In any Claude Code session, describe your task. When Claude detects the trigger conditions (N>=10 units, ranking needed, adversarial rigor, "use a workflow", "ultracode"), it loads this skill, classifies the task, and returns:

```
🎯 Pattern: <name> (<one-line why>)

📋 Paste this into Claude Code:
ultracode: <single-sentence task>

📜 Workflow script: templates/<name>.js (plug in your values at the top)

👀 Watch: /workflows
💾 Save: press `s` in /workflows view once it works
```

## What's inside

```
workflow-selector/
├── SKILL.md                          # entry point: classifier + when-to-use
├── references/
│   ├── pattern-rubric.md            # the 7 patterns, signals, anti-patterns
│   ├── composition-cheatsheet.md    # real tasks → pattern stacks
│   └── examples.md                  # 8 worked examples from the article
├── templates/
│   ├── classify-and-act.js          # 7 base pattern templates
│   ├── fan-out-synthesize.js
│   ├── adversarial-verify.js
│   ├── generate-filter.js
│   ├── tournament.js
│   ├── loop-until-done.js
│   ├── model-route.js
│   ├── refactor-fleet.js            # 3 composition templates
│   ├── claim-verifier.js
│   └── session-rule-miner.js
└── scripts/
    └── validate.py                  # structural + syntax checks
```

## The 7 patterns

| # | Pattern | When to use |
|---|---------|-------------|
| 1 | **classify-and-act** | Task starts with "what kind of X is this?" |
| 2 | **fan-out-synthesize** | N independent units, one synthesis at the end |
| 3 | **adversarial-verify** | Each output needs checking by a separate agent |
| 4 | **generate-filter** | Brainstorm many, filter to top K |
| 5 | **tournament** | Rank by pairwise judgment (better than absolute scoring) |
| 6 | **loop-until-done** | Unknown work amount, stop on a signal |
| 7 | **model-route** | Different parts want different model sizes |

Read `references/pattern-rubric.md` for the full classifier.

## Limits (from the article + docs)

- **100 agents per run** (hard cap)
- **25 tool calls per agent**
- **50 min max runtime**
- Trigger keyword: `ultracode` (v2.1.160+) or `workflow` (older)
- Requires Claude Code v2.1.154+ and dynamic workflows enabled in `/config`

## Modifiers — `/goal` and `/loop`

These are **orthogonal to pattern selection** — they compose onto any pattern. See `SKILL.md` for the full guide.

| Modifier | Use when | Example |
|---|---|---|
| `/goal "<bar>"` | Hard completion requirement (don't stop until X) | `/goal: at least 5 verified patterns` |
| `/loop every <interval>` | Recurring task, run on a schedule | `/loop every 1h` |
| `/goal + /loop` | Both — burns tokens, only when explicitly needed | `/loop every 30m /goal: process all open tickets` |
| None | One-shot, bounded task | (default) |

## Saving a good run

Press `s` in the `/workflows` view after a successful run. The script becomes a slash command in `~/.claude/workflows/`. The whole point of dynamic workflows is repeatability — if a one-off didn't get saved, it was probably the wrong tool.

## License

MIT. Use freely.
