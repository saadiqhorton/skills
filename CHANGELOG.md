# Changelog

All notable changes to this collection of skills are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for each individual skill (the repo as a whole uses a different cadence — see [Release Notes](#release-notes) below).

## [Unreleased]

### Changed
- **Install method** — switched from custom `install.sh` to the open [`skills`](https://github.com/vercel-labs/skills) CLI
  - `npx skills add saadiqhorton/skills@<skill>` installs a single skill without cloning the repo
  - Documents install scope: project-local is the default (no flag); use `-g` / `--global` for user-level installs
  - Supports agent targeting (`-a`), listing (`-l`), and `--all`

### Removed
- **`install.sh`** — replaced by `npx skills`

### Planned
- **`devops/` category** — homelab, Docker, Proxmox, network operations
- **`finance/` category** — budgeting, bank integrations, transaction tracking
- **`productivity/` category** — note-taking, kanban, daily workflows
- **`career/` category** — resume, certifications, WGU tracking, professional branding

---

## Release Notes

### 2026-06-03 — Initial commit

- **`workflow-selector` v0.2.0** — first skill published
  - Classifier for 7 dynamic workflow patterns (classify-and-act, fan-out-synthesize, adversarial-verify, generate-filter, tournament, loop-until-done, model-route)
  - Modifier support: `/goal` and `/loop` (orthogonal to pattern selection)
  - 10 ready-to-customize ESM templates (7 base patterns + 3 composition recipes: `refactor-fleet`, `claim-verifier`, `session-rule-miner`)
  - 3 reference docs: `pattern-rubric.md`, `composition-cheatsheet.md`, `examples.md`
  - Built-in validator (`scripts/validate.py`) — 19 structural + syntax checks
  - Source: [Thariq, "A harness for every task: dynamic workflows in Claude Code"](https://x.com/trq212/status/2061907337154367865) (Jun 2 2026)
  - Provenance: adapted from the official [Claude Code workflows docs](https://code.claude.com/docs/en/workflows)

### Skill versioning policy

Each skill is versioned independently using semver:
- **MAJOR** — breaking changes to the skill's API or contract (e.g. a required config field, a renamed template)
- **MINOR** — new patterns, templates, references, or backward-compatible improvements
- **PATCH** — docs fixes, validator improvements, typo corrections

The repo's top-level `README.md` shows the latest version of each skill.
