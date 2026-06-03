---
name: workflow-selector
description: Use when a task may benefit from a Claude Code dynamic workflow but the right pattern isn't obvious. Classifies the task into one of 7 orchestration patterns (classify-and-act, fan-out-synthesize, adversarial-verify, generate-filter, tournament, loop-until-done, model-route) and returns a ready-to-paste prompt + JS template. Triggers on phrases like "use a workflow", "ultracode", or any task with N>=10 independent units, ranking needs, or adversarial rigor.
---

# Workflow Selector

Classifies a freeform task into the right Claude Code **dynamic workflow** pattern, then hands back a copy-paste prompt + JS template. Source: Thariq's "A harness for every task" article (Jun 2 2026) + `code.claude.com/docs/en/workflows`.

## When to use

- The user describes a task with N>=10 independent units (items to verify, files to migrate, claims to check, candidates to rank).
- The user says "use a workflow", "ultracode", "set up a workflow", or "this needs more than one Claude".
- The user is stuck on a problem where a single context would either lose the plot (goal drift), get lazy (agentic laziness), or favor its own work (self-preferential bias).
- The user is choosing between "Claude plan-and-execute in one context" vs. "spawn N subagents."

**Do NOT use** for: regular coding tasks under 10 files; tasks where the user wants to stay in conversation; tasks the user has already designed a workflow for.

## The 7 Patterns

Read `references/pattern-rubric.md` for the full classifier. Quick map:

| # | Pattern | Use when... | Article example |
|---|---------|-------------|-----------------|
| 1 | **classify-and-act** | Task needs routing by type before action | "best model for the task depends on codebase shape" |
| 2 | **fan-out-synthesize** | N independent units, one synthesis at the end | `/deep-research`, claim verification |
| 3 | **adversarial-verify** | Each output must be checked against a rubric by a separate agent | Code review, fact verification, rule adherence |
| 4 | **generate-filter** | Many candidates → dedupe → score → keep top K | Naming, design exploration, rule mining |
| 5 | **tournament** | Rank by comparative judgment (better than absolute scoring) | Resume ranking, name brainstorming |
| 6 | **loop-until-done** | Unknown work amount; stop when condition fires | Triage queues, incident digests, root-cause hunting |
| 7 | **model-route** | Different parts of the task need different model sizes | Cheap classification + expensive synthesis |

Most real tasks compose 2-3 of these. Default order to try: **fan-out-synthesize → adversarial-verify → loop-until-done**. If a `references/composition-cheatsheet.md` exists, read it.

## Classifier procedure

1. **Extract task shape from the user's prompt:**
   - `N`: how many independent units? (count files, items, claims, candidates)
   - `verifier_needed`: does each output need to be checked? (y/n)
   - `ranking_needed`: is the goal a ranked list? (y/n)
   - `loop_signal`: is the work amount unknown / recursive? (y/n)
   - `heterogeneous_models`: do different parts want different models? (y/n)
   - `routing_signal`: does the task start with "decide what kind of X this is"? (y/n)

2. **Match against the 7 patterns** using the rubric. State the match in one line. If two patterns tie, prefer the one that appears first in the table above unless the user said otherwise.

3. **Check the runtime budget** (article limits: 100 agents/run, 25 tool calls/agent, 50 min max). If the task needs more, propose splitting or downscoping before running.

4. **Output the recipe:**
   - A `ultracode: <one-line task>` line the user can paste into Claude Code
   - The matching JS template from `templates/`, with the user's task plugged in
   - A "watch with `/workflows`" reminder
   - A "save with `s` after a good run" reminder

## Output format (always)

```
🎯 Pattern: <name> (<one-line why>)
🔁 Modifiers: <none | /goal "<completion requirement>" | /loop | /goal + /loop>

📋 Paste this into Claude Code:
ultracode: <single-sentence task>[, /goal: <hard completion req>][, /loop every <interval>]

📜 Workflow script: templates/<name>.js (plug in your values at the top)

👀 Watch: /workflows   (↑↓ to inspect, p to pause, x to stop, s to save)
💾 Save: press `s` in /workflows view once it works → ~/.claude/workflows/

⚠️  Limits: 100 agents/run · 25 tool calls/agent · 50min max
```

## Modifiers — `/goal` and `/loop`

The article is explicit: these are **not separate patterns**, they're **orthogonal modifiers** that compose onto any pattern. Default to including them when the signals match.

### `/goal "<hard completion requirement>"`

**What it does:** Forces the workflow to keep running until a specific bar is met. The agent cannot declare "done" until the completion requirement is satisfied.

**Use when:**
- The user says "don't stop until", "keep going until", "make sure", "until N are done"
- The task has a quantitative completion bar (N items processed, all tests pass, all claims verified)
- The task is high-stakes and you want a guarantee, not a "best effort"

**Article's own example** (verbatim from the article):
> *"This test fails maybe 1 in 50 runs. Set up a workflow to reproduce it, form theories and adversarially test them in worktrees **/goal don't stop until one theory works**."*

**Anti-patterns:**
- Don't add `/goal` to short tasks — the runtime cap (50 min) will force-quit anyway
- Don't add `/goal` to tasks with subjective completion ("a good report") — the agent can't tell when it's met. Be specific: "all 50 sessions mined", "top 3 names ranked"
- Don't combine `/goal` with `/loop` unless the user explicitly wants continuous AND complete (see below)

**Best-fit patterns:** adversarial-verify (verify N of M items), fan-out-synthesize (process all N units), loop-until-done (combined with the inner stop condition)

### `/loop` (with an interval, e.g. `/loop every 1h`)

**What it does:** Re-runs the workflow on a schedule. The output of one run feeds into the next.

**Use when:**
- The user says "continuously", "every hour/day/week", "keep an eye on", "monitor"
- The task is recurring by nature: triage, monitoring, syncing, periodic digests
- The state to operate on changes over time (new tickets, new commits, new log lines)

**Article's own example** (verbatim):
> *"Pair triage workflows with /loop to have Claude do this continuously."*

**Anti-patterns:**
- Don't add `/loop` to a one-shot task. If they say "go through my 50 sessions ONCE," `/loop` is wrong
- Don't add `/loop` to a deterministic task (e.g. "rename User to Account") — it has no state to refresh
- The interval matters. `/loop every 1m` will burn tokens fast. Default the suggestion to hourly or daily unless the user says otherwise

**Best-fit patterns:** loop-until-done (by definition), classify-and-act (continuous triage), generate-filter (periodic distillation of new sessions/data)

### Combining `/goal` + `/loop`

This is a **powerful but dangerous** combo. The user wants:
- Continuous re-runs (`/loop`)
- Each run must reach a hard completion bar (`/goal`)

Use only when:
- The user explicitly asks for both
- The completion bar is per-run, not cumulative (e.g. "each run processes 10 tickets" not "all tickets ever")
- They've accepted the token cost (this will burn)

**Article's own guidance** (paraphrased):
> *"When using workflows that can be repeated, for example triage, research, or verification, pair them with /loop to be run at regular intervals, and /goal to set a hard completion requirement."*

### Decision rule for modifiers

Ask these three questions in order:
1. **Is there a hard completion bar?** → add `/goal "<bar>"`
2. **Is the task recurring?** → add `/loop every <interval>`
3. **Neither?** → no modifiers, just `ultracode: <task>`

### Modifier syntax in the output

Always include them in the `ultracode:` prompt line itself, not as separate instructions. Examples:

```
ultracode: mine #incidents for the past 6 months for recurring root causes /goal: cluster + verify at least 5 patterns
```

```
ultracode: triage incoming support tickets /loop every 30m /goal: process all tickets in the queue
```

```
ultracode: rename User to Account everywhere /goal: all files updated and tests pass
```

**Plain `ultracode:` (no modifier) is the default for one-shot tasks.** Don't add `/goal` or `/loop` by reflex.

## Examples (truncated — see `references/examples.md` for full prompts)

- *"Go through my last 50 sessions and mine them for corrections I keep making and turn the recurring ones into CLAUDE.md rules"* → **loop-until-done** (mine) → **generate-filter** (distill) → **adversarial-verify** (check each rule would have prevented a real mistake)
- *"Use a workflow to dig through #incidents in Slack for the past six months and find recurring root causes where nobody has filed a ticket"* → **loop-until-done** (mine until no new findings)
- *"Go through my blog post draft and verify every technical claim against the codebase"* → **fan-out-synthesize** (one agent per claim) → **adversarial-verify** (source-quality check)
- *"Take 80 resumes, rank for backend role, double-check top 10"* → **fan-out-synthesize** (initial scoring) → **tournament** (top-10 pairwise)
- *"Find the best name for this CLI tool"* → **generate-filter** (brainstorm) → **tournament** (top 3)
- *"Rename our User model to Account everywhere"* → **fan-out-synthesize** (one agent per file in worktree) → **adversarial-verify** (reviewer per change)

## Pitfalls

- **"Use a workflow" is not a task** — the user must have a specific thing they want done. If vague, ask one clarifying question: "What does success look like in one sentence?" Don't ask about the workflow choice itself.
- **Don't pre-build the script for the user** — output the template + plug-points, let Claude Code write the script for the actual task. The whole point of dynamic workflows is that Claude writes them.
- **Workflows are not a default** — the article is explicit: most tasks don't need them. Push back on the user if they're reaching for a workflow on something the default harness handles fine. "Do you really need 5 reviewers on this?" is a legitimate question.
- **Watch token cost** — `/workflows` view shows per-phase token totals. If a phase is burning >5x expected, pause and inspect.
- **Save good runs** — pressing `s` in the workflow viewer turns the script into a slash command. The whole point of a workflow is that you re-run it. If a one-off doesn't get saved, it was probably the wrong tool.
- **Resumable, not restartable** — if a workflow is interrupted (user action, terminal quit), resuming the session picks it up. You don't have to start over.

## Hard requirements (any task you accept)

1. The user can articulate the task in one sentence.
2. The task has a clear "done" signal (not "explore X" — that's research, different pattern).
3. The work decomposes into >=3 independent units. Below that, just do it directly.
4. The user is OK with the runtime budget (100 agents / 50 min cap).

If any of these fail, say so and propose a smaller alternative.
