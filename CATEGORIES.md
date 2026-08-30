# Categories

Skills are grouped into category folders by domain. The current categories reflect common areas of agentic + DevOps + personal productivity work; add new ones as needs emerge.

| Category | Domain | Examples |
|---|---|---|
| `agentic-dev/` | Building and orchestrating AI agents (Claude Code, dynamic workflows, multi-agent systems) | `workflow-selector/` |
| `software-development/` | Writing and reviewing production-grade code (Python, design principles, refactoring) | `production-python-code/` |
| `devops/` | Homelab, infrastructure, deployment, monitoring | (planned) |
| `finance/` | Personal finance, banking integrations, transaction tracking | (planned) |
| `productivity/` | Note-taking, kanban, daily workflows | (planned) |
| `career/` | Resume, certifications, WGU tracking, professional branding | (planned) |
| `data-science/` | ML modeling, stats, training, evals | (planned) |
| `creative/` | Image generation, video, music, design | (planned) |
| `research/` | Web research, paper discovery, KB building | (planned) |

## Adding a new category

1. Create a folder: `mkdir -p <category-name>`
2. Drop skills in as `<category-name>/<skill-name>/`
3. Update this file with a one-line description
4. Update the top-level `README.md` table
5. Add a `CHANGELOG.md` entry under "Unreleased"

## When to make a new category vs. reusing one

**Make a new category** when the skills in it share a common tooling surface (e.g. all `devops/` skills touch Docker) or a common user persona (e.g. all `career/` skills are about the job search). The bar is "would I open this folder looking for a specific kind of thing?"

**Reuse an existing category** when the new skill is a natural extension of what's there. `tournament-ranker` (planned) goes in `agentic-dev/` because it's a Claude Code pattern, even though it could theoretically help with resume ranking. Category = domain, not use case.
