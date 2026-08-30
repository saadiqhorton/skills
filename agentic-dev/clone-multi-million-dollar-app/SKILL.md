---
name: clone-multi-million-dollar-app
description: "Clone a $1M+ paid app into a free open-source self-hosted one with AI agents."
version: 1.0.0
author: Saadiq Horton (saadiqhorton), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [strategy, open-source, saas, ai-agents, product]
    related_skills: []
---

# Clone a Multi-Million-Dollar App

Rebuild a recognizable, expensive paid SaaS into a free, self-hostable,
open-source (MIT) alternative using an AI coding agent. This is the playbook
Nate Herk used to clone **Calendly** (~$3B valuation) into **SnagTime** — a free
scheduling app he can run locally — in ~5 days of active agent work. The method
is **agent-agnostic**: it works with any capable coding agent (Codex, Claude
Code, Cursor, OpenCode, Gemini). It does not matter which one; the structure and
the judgment are yours either way.

## When to use

- You want to clone the **core experience** of a famous, high-priced SaaS
  (Calendly, GoHighLevel, Linear, etc.) into a self-hosted free app.
- You're choosing *which* paid product is worth cloning and want a
  proven, bounded scope.
- You want the agent to do the heavy build and you'll do the human judgment
  (UX, rebranding, performance, ownership).

**Don't use it to** clone a whole enterprise suite or to claim "AI built it so
I'm done" — the ownership and maintenance are the real product.

## The four-phase `/goal` prompt (the seed)

Everything starts from ONE large seed prompt that forces the agent through four
phases in order, then into a test→build→test loop. Shape it like this (fill the
brackets):

> We're going to clone [Calendly] here. I want to be able to run it locally and
> for free. Work in four phases:
> **1. Research** — research [Calendly] and [cal.com] and find what people say
> they like and dislike about each. Take that into planning.
> **2. Planning** — turn the research into the features and functionality we
> want, and plan how we'll feasibly do it with sub-agents, a backend database,
> and integrations.
> **3. Build** — build the application.
> **4. Test** — then enter a loop: test, find bugs, fix them, test again, keep
> going.

The last phase is the one people skip. Do not stop at a proof-of-concept.

## The agentic autonomous testing loop

This is the differentiator. After building, do NOT accept a POC:

- Put **~50 sub-agents** (a "swarm") through the flows: admin experience, signup
  / account creation, creating an event type, and the booking flow.
- Have them keep looping: **build → find bugs → fix → test again → find more
  bugs → fix**. Run this for days, not once.
- Nate's build reused ~**76 unique sub-agents** across **300+ delegations** and
  used ~**334 aggregate agent-hours** (running in parallel) over **5 days 5 hours**
  of active agent time (~2 weeks wall-clock).

## The research matters most

Before planning, ground the clone in what real users complain about. Research the
incumbent **and** its main competitor, then make the feature list from the gaps
and the praise you find. This keeps you from cloning the wrong things.

## You still own the software layer

This is his repeating theme and the reason the clone is actually valuable. After
the build:

- **Agents find technical bugs; you must judge UX.** Example from the video: the
  booking review screen had a progress bar that *looked* clickable but only a
  tiny arrow navigated. The agents clicked through endlessly without flagging it.
  A human caught it immediately and had it redesigned.
- **The first output often looks "vibe coded."** His first build was named
  **TempoCove** and looked bad. He had to rebrand (to SnagTime — the project
  folder still says TempoCove) and redesign the UI. Budget for a rebrand +
  design-feedback round.
- **Do a performance pass.** His build was laggy (mouse glitch, slow typing). He
  sent a `/goal` to cut load time to ~**10ms** instead of ~1s. Slow-feeling apps
  are the thing agents miss.
- **You own the consequences.** "There's a big difference between a product you
  can use internally for a small team and one you want to scale to tens of
  thousands of dollars per month." Inference, databasing, bugs, security,
  support, and a stream of feature requests all become yours. When you hit a pain
  point, ask the agent to add the feature — it's fully aware of the app now.

## The honest economics (so you go in clear-eyed)

Nate's real numbers from the video:

| Metric | Value |
|---|---|
| Active agent time | 5 days 5 hours (~2 weeks wall-clock) |
| Aggregate agent-hours | 334 (parallel) |
| Unique sub-agents | 76 (heavily reused; 300+ delegations) |
| Input tokens | 32.1 billion |
| Output tokens | 47 million |
| Equivalent inference cost | ~$15,000 |
| What he actually paid | ~$150 out-of-pocket on top of a **$200/mo Codex** plan |

Plan economics: a **$200/mo Codex** plan delivers ~**$14k** of inference when
maxed; a **$200/mo Claude Code** plan delivers only ~**$8k** — roughly **$6k
less**. So the "free clone" is only cheap if you're already riding a maxed
subscription.

**It is not free forever.** To truly use it you'll send a few prompts every month
to fix bugs and add features. It's usually better than a recurring SaaS
subscription *if you're willing to dedicate headspace to maintenance*. The
subscription cost gets replaced by ownership.

## Scope it to the boring 80%

Clone the part users actually pay for, not the enterprise features. For a
scheduler that's: account/signup, event types (custom durations, colors, slugs,
descriptions), weekly availability + date overrides + time off + timezone +
buffer + minimum notice, a public branded booking page, custom pre-booking
questions, booking confirm/reschedule/cancel, a calendar integration, and email
notifications. Paid event types route through Stripe Checkout.

## Reference stack that works

Next.js + TypeScript + Prisma + PostgreSQL (SQLite for the free local demo) +
Tailwind + a background worker + Docker. MIT. **Only clone something you'll
personally run** — dogfooding is what keeps you invested and motivated to fix it.

## Replicate the build loop

1. Write the four-phase `/goal` seed prompt (above) and fire it at your agent.
2. Let it research → plan → build. Review the plan before the build.
3. Demand the **testing swarm loop** — don't accept a POC. Run tests for days.
4. Review the actual UX yourself. Rebrand + redesign iteratively; agents miss
   design and experience.
5. Send a performance `/goal` pass (target ~10ms felt latency).
6. Add your external credentials (calendar OAuth, Stripe, SMTP) and deploy to a
   public domain. Off-the-shelf: it runs on localhost for free during dev; real
   public use needs your own accounts.

## Pitfalls

- **Don't scale-pretend.** An agent-built clone that works for you is not a
  SaaS business. Bugs, infra, support, and feature requests don't build
  themselves.
- **Don't skip the human UX + rebrand + performance passes.** These are exactly
  the parts the agents get wrong.
- **Verify against the live app, not the agent's report.** Run it, click it, book
  a slot.
- **External integrations cost money and need your accounts.** Google OAuth,
  Stripe, and SMTP are yours to configure and pay for; they're not "free."
- **License + API-key hygiene.** Publish MIT, but never commit real secrets; use
  sandbox keys for any demo.

## Verification

- App runs locally from a clean clone (`npm run demo:free` equivalent for your
  stack) and shows the seeded demo state.
- You personally walked the booking flow end-to-end: pick a slot, answer
  questions, confirm, receive the invitation, reschedule, cancel.
- Calendar sync reflects a busy block you create on your real calendar.
- A paid event type routes through Stripe Checkout (sandbox) before confirming.
- The whole flow feels responsive (no perceptible mouse/typing lag).
