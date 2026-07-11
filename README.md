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
| [`corigin-mapreduce/`](./agentic-dev/corigin-mapreduce) | v1.0.0 | Matt Rickard, Jul 5 2026 — *"Rebuilding Cognition's Agentic MapReduce"* | Runs parallel agent work across large codebases using **git branches as the communication layer**: worker proposal branches reduced into candidate branches across multiple iterations. Generalizes Cognition's security swarm pattern for any large-scale agent task. |

## Install

Install a single skill without cloning the whole repo:

```bash
# One-liner (recommended) — installs to ~/.claude/skills/
curl -fsSL https://raw.githubusercontent.com/saadiqhorton/skills/main/install.sh | bash -s -- workflow-selector

# Or for Cursor skills:
curl -fsSL https://raw.githubusercontent.com/saadiqhorton/skills/main/install.sh | bash -s -- --target ~/.cursor/skills workflow-selector

# List available skills
curl -fsSL https://raw.githubusercontent.com/saadiqhorton/skills/main/install.sh | bash -s -- --list
```

If you've already cloned this repo, you can run `./install.sh` locally:

```bash
./install.sh workflow-selector
./install.sh agentic-dev/corigin-mapreduce
./install.sh --target ~/.cursor/skills corigin-mapreduce
```

The installer uses a **sparse git checkout** — it only downloads the skill folder you asked for, not the entire repo. Skills with validators (like `workflow-selector`) run them automatically after install.

Legacy options:

```bash
# Clone the whole repo and copy manually
git clone https://github.com/saadiqhorton/skills.git
cp -r skills/agentic-dev/workflow-selector ~/.claude/skills/
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
