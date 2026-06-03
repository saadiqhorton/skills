# skills

A collection of agentic dev skills I've built or adapted for personal use. Each skill is self-contained and ships in its own folder with installation instructions.

## Skills

| Skill | Source | Purpose |
|---|---|---|
| [`workflow-selector/`](./workflow-selector) | Thariq (Anthropic), Jun 2 2026 — *"A harness for every task: dynamic workflows in Claude Code"* | A Claude Code skill that classifies a freeform task into the right **dynamic workflow** pattern (7 base patterns + 3 composition recipes) and hands back a copy-paste `ultracode:` prompt with the right `/goal` and `/loop` modifiers. Includes 10 ready-to-use JS workflow templates. |

## Conventions

Each skill folder follows the standard Claude Code skill layout:

```
skill-name/
├── SKILL.md                  # entry point: when-to-use + classifier + output format
├── README.md                 # human-readable install + usage
├── references/               # long-form docs (rubrics, cheatsheets, examples)
├── templates/                # ready-to-customize code templates
└── scripts/                  # validators, linters, helpers
```

Install any skill into your local Claude Code:

```bash
# Option 1: clone the whole repo and copy what you want
git clone https://github.com/saadiqhorton/skills.git
cp -r skills/workflow-selector ~/.claude/skills/

# Option 2: download a single skill as a zip from GitHub's UI
# Then: unzip workflow-selector.zip -d ~/.claude/skills/workflow-selector
```

## License

MIT. Use freely. Attribution appreciated but not required.
