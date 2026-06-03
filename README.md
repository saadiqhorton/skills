# skills

A categorized collection of agentic dev, DevOps, and personal productivity skills I've built or adapted for personal use. Each skill is self-contained and ships in its own folder with installation instructions.

## Layout

```
skills/
├── agentic-dev/          # AI agents, dynamic workflows, multi-agent systems
├── devops/               # (planned) homelab, Docker, Proxmox, network ops
├── finance/              # (planned) personal finance, banking, transactions
├── productivity/         # (planned) notes, kanban, daily workflows
├── career/               # (planned) resume, certs, WGU tracking, branding
├── data-science/         # (planned) ML modeling, stats, training
├── creative/             # (planned) image gen, video, music, design
├── research/             # (planned) web research, papers, KB building
├── CHANGELOG.md          # version history per skill
├── CATEGORIES.md         # category definitions + when to add new ones
└── README.md             # this file
```

See [`CATEGORIES.md`](./CATEGORIES.md) for the rationale behind each category and when to create a new one.

## Skills

### `agentic-dev/`

| Skill | Version | Source | Purpose |
|---|---|---|---|
| [`workflow-selector/`](./agentic-dev/workflow-selector) | v0.2.0 | Thariq (Anthropic), Jun 2 2026 — *"A harness for every task: dynamic workflows in Claude Code"* | Classifies a freeform task into the right **Claude Code dynamic workflow** pattern (7 base + 3 compositions) and returns a copy-paste `ultracode:` prompt with the right `/goal` and `/loop` modifiers. Includes 10 ready-to-use ESM templates. |

## Install

```bash
# Option 1: clone the whole repo and copy a single skill
git clone https://github.com/saadiqhorton/skills.git
cp -r skills/agentic-dev/workflow-selector ~/.claude/skills/

# Option 2: grab a single skill as a zip from GitHub's UI
# Then: unzip workflow-selector.zip -d ~/.claude/skills/workflow-selector

# Verify
python3 ~/.claude/skills/workflow-selector/scripts/validate.py
```

## Conventions

Each skill folder follows the standard Claude Code skill layout:

```
<category>/<skill-name>/
├── SKILL.md                  # entry point: when-to-use + classifier + output format
├── README.md                 # human-readable install + usage
├── references/               # long-form docs (rubrics, cheatsheets, examples)
├── templates/                # ready-to-customize code templates
└── scripts/                  # validators, linters, helpers
```

## Versioning

Each skill is versioned independently using [semver](https://semver.org/):
- **MAJOR** — breaking changes to the skill's API or contract
- **MINOR** — new patterns, templates, references, or backward-compatible improvements
- **PATCH** — docs fixes, validator improvements, typo corrections

See [`CHANGELOG.md`](./CHANGELOG.md) for the version history of every skill.

## Adding a new skill

1. Pick the right category from `CATEGORIES.md` (or create a new one)
2. `mkdir -p <category>/<skill-name>` with the standard layout
3. Add a row to the skills table in this file
4. Add an entry under `[Unreleased]` in `CHANGELOG.md`
5. Validate the skill before committing

## License

MIT. Use freely. Attribution appreciated but not required.
