# corigin-mapreduce

A Claude Code skill for running parallel agent work across large codebases using **git branches as the communication layer** — worker proposals, candidate reduction, multi-iteration loops. Based on Matt Rickard's reverse-engineered [Cognition Agentic MapReduce](https://devin.ai/blog/agentic-map-reduce).

## Install

```bash
npx skills add saadiqhorton/skills@corigin-mapreduce
```

## Use

Describe your task — scanning a repo for vulnerabilities, auditing dependencies, reviewing N modules, or doing any parallel work across a codebase. When the skill triggers, it sets up the map-reduce loop automatically:

```
1. Coordinator shards by folder → creates worker branches
2. Workers run in parallel (fresh sessions, isolated branches)
3. Reducer merges accepted findings → candidate branch
4. Loop: next iteration continues, verifies, or deepens
```

## What's inside

```
corigin-mapreduce/
├── SKILL.md    # entry point: protocol, coordinator, worker specs
└── README.md   # this file
```

## Protocol overview

| Stage | What happens |
|---|---|
| **Map** | Coordinator shards the codebase by folder/package, each worker gets its own git branch |
| **Reduce** | Reducer reads every branch, dedupes + merges compatible findings → `candidate/<n>` |
| **Loop** | Next mapper allocates workers from candidate, continuation, or fresh shard |

### Naming

- `refs/heads/corigin/<run>/candidate/<iter>` — reduced result (coordinator writes)
- `refs/heads/corigin/<run>/worker/<iter>/<unit>` — worker proposals (each worker writes its own)

### Key properties

- **Fault tolerant** — checkout latest candidate branch to resume
- **Auditable** — every change is a commit, traced to worker + iteration via branch history
- **Generalizable** — code edits, research findings, security audits, migrations — no task assumptions

## Origin

- **Source:** [Rebuilding Cognition's Agentic MapReduce](https://blog.matt-rickard.com/p/rebuilding-cognitions-agentic-mapreduce) by Matt Rickard (Jul 2026)
- **Based on:** [Cognition's Agentic MapReduce](https://devin.ai/blog/agentic-map-reduce) for security swarm scanning
- **Remote layer:** [Corigin](https://corigin.dev/) — git for agents (repos by API, fast clone/push, branch-scoped tokens)

## License

MIT. Use freely.
