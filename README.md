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

Uses the open [skills](https://github.com/vercel-labs/skills) CLI — no repo clone required:

```bash
# Project-local (default) — installs under ./<agent>/skills/ in the current repo
npx skills add saadiqhorton/skills@workflow-selector

# Global — available across all projects (omit for project-local)
npx skills add saadiqhorton/skills@workflow-selector -g

# Target a specific agent
npx skills add saadiqhorton/skills@workflow-selector -a cursor

# List skills in this repo
npx skills add saadiqhorton/skills -l

# Install everything
npx skills add saadiqhorton/skills --all
```

### Install scope

| Scope | Flag | Location | Use case |
|---|---|---|---|
| **Project** | *(default — no flag)* | `./<agent>/skills/` | Commit with the repo, share with the team |
| **Global** | `-g` / `--global` | `~/<agent>/skills/` | Available across all projects |

There is no separate `--project` flag on `add` — project-local is the default when you omit `-g`.

Requires Node.js (for `npx`). See the [skills CLI docs](https://github.com/vercel-labs/skills) for more options (`--copy`, `--yes`, multi-agent install, etc.).

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
