# Clone a Multi-Million-Dollar App (agent-agnostic)

Rebuild a recognizable, expensive paid SaaS into a free, self-hostable,
open-source (MIT) alternative using an AI coding agent. This encodes the playbook
Nate Herk used to clone Calendly (~$3B valuation) into **SnagTime** in ~5 days of
active agent work — grounded in the actual video, not just a summary.

## Install

```bash
# Project-local (default) → ./<agent>/skills/
npx skills add saadiqhorton/skills@clone-multi-million-dollar-app

# Global → ~/<agent>/skills/
npx skills add saadiqhorton/skills@clone-multi-million-dollar-app -g
```

## What this skill does

Works with any coding agent (Codex, Claude Code, Cursor, OpenCode, Gemini). It
gives you a repeatable five-part loop:

1. **Seed a four-phase `/goal` prompt** — research → planning → building →
   testing — instead of a single vague "build X" request.
2. **Run an agentic testing swarm** — dozens of sub-agents (Nate used ~76,
   300+ delegations) looping build → find bugs → fix → test → repeat, for days.
   *Do not stop at a proof-of-concept.*
3. **Research the incumbent AND its competitor first**, so you clone what users
   actually praise/complain about.
4. **You own the software layer** — agents find technical bugs, but you judge UX,
   fix the "vibe-coded" look (his first was named TempoCove, rebranded to
   SnagTime), run a performance pass (~10ms felt latency), and own the
   maintenance forever.
5. **Know the real economics** — 5 days 5 hrs active ~ 334 aggregate agent-hours
   ~ 32B input tokens ~ **$15k equivalent**, delivered by maxing a **$200/mo
   Codex** plan (~$14k of inference; Claude Code at the same price yields ~$8k).
   Free ≠ zero; it's a subscription-cost-for-ownership trade.

## Contents

- `SKILL.md` — the full playbook: when to use, the four-phase seed prompt, the
  testing swarm, research-first rule, the own-the-software-layer lesson, honest
  economics, scoping to the boring 80%, a reference stack, and verification steps.

## License

MIT. Use freely.
