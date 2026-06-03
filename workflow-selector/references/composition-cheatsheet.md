# Composition Cheat-Sheet — Real Tasks → Pattern Stacks

Most real-world tasks compose 2-4 patterns. This file is a worked map: given a task, here's the stack the article's authors would use.

## How to read this

Each row is a task archetype. The "Stack" column shows the patterns applied in order. The "Why this order" column explains the dependency. Use this when the user gives you a task that doesn't match a single pattern cleanly.

## Cheat-sheet

| Task archetype | Stack | Modifiers | Why this order |
|---|---|---|---|
| **Verify every claim in a document** | fan-out (1/claim) → adversarial-verify (source quality) → synth | `/goal: verify all N claims` | Independent claims, each needs a primary source, then a judge for source reliability |
| **Rank 100+ items by qualitative judgment** | fan-out (initial score) → tournament (top 10 pairwise) → adversarial-verify (top 3) | none | The deterministic loop holds the structure; goal is implicit (top 3 by definition) |
| **Brainstorm names, pick the best** | generate-filter (brainstorm 30) → tournament (top 3) | none | Bounded task; goal is "top 3" implicit in the request |
| **Mine logs/Slack/tickets for recurring root causes** | loop-until-done (mine until no new) → generate-filter (cluster) → adversarial-verify (each cluster is a real root cause) | `/goal: at least 5 verified patterns` | Loop because you don't know the count. Cluster then verify because the raw list has noise |
| **Migrate a 500-file codebase (rename, swap lib)** | fan-out (1/file in worktree) → adversarial-verify (reviewer per change) → gate-merge | `/goal: all files updated and tests pass` | One agent per file for parallelism, reviewer per change for safety, gate the merge on reviewer pass |
| **Debug a hard bug, current Claude is biased** | loop-until-done (one loop per evidence source: logs, git, files, data) → adversarial-verify (verifier + refuter per hypothesis) | `/goal: one theory confirmed and reproduced` | Disjoint evidence prevents shared bias. Verifier + refuter prevents self-preferential bias |
| **Triage a backlog continuously** | loop-until-done (mine) → classify-and-act (priority/type) → quarantine-actor (separate read-priv from act-priv) | `/loop every 30m /goal: process all open tickets` | Continuous, type-aware, and the quarantine pattern (article: *"agents that read untrusted public content can't take high-privilege actions"*) |
| **Distill 50 sessions into CLAUDE.md rules** | loop-until-done (mine) → generate-filter (cluster) → adversarial-verify (would-this-rule-have-prevented-it?) → write | `/goal: at least 3 surviving rules` | Loop for unknown count, cluster for organization, verify each candidate against a real failure |
| **Research a question across many sources** | model-route (cheap searches, expensive synthesis) → fan-out (one search/angle) → adversarial-verify (cross-check) → synth | none | Heterogeneous models save tokens; fan-out is the spine; cross-check is the quality pattern. **This is `/deep-research` exactly.** |
| **Score resumes at scale** | fan-out (initial scoring on all) → tournament (top 10) → adversarial-verify (top 3) | none | Cheap absolute scoring filters the field, comparative judgment ranks the leaders, deep review picks the winner |
| **Decide which model to use for a task** | model-route (Sonnet classifier → {Sonnet, Opus} executors) | none | The classifier must be cheap. If you can't tell cheap-vs-hard with Sonnet, you can't tell at all. |
| **Run a multi-angle design review** | fan-out (3 angles: investor, customer, competitor) → adversarial-verify (each angle by the other 2) → synth | none | Independent perspectives prevent group-think. Adversarial cross-check prevents each angle from rubber-stamping itself |
| **Build a feature with quality bar** | fan-out (1/file/module in worktree) → adversarial-verify (reviewer per module) → integration-test agent → ship | `/goal: integration tests pass` | Standard refactor fleet + final integration check |
| **Continuously monitor a system for issues** | loop-until-done (one loop per time window) → classify-and-act (severity) → notify | `/loop every 5m /goal: scan complete and any new issues triaged` | Run forever with `/loop`. Classify to prioritize. Notify only on real signal. |

## Composition rules of thumb

1. **Fan-out is the spine.** Most stacks start with it. If you're not fanning out, you're probably under-using the workflow.

2. **Adversarial-verify is the immune system.** Default to including it on each output. The cost is real; the article's authors accept it because the alternative (self-bias) is worse.

3. **Tournament comes after fan-out, not instead of it.** Use fan-out to filter to a manageable shortlist, then tournament to rank. Pure tournament on 1000 items is 999 comparisons — too expensive.

4. **Loop-until-done is the wrapper, not the worker.** Wrap the inner pipeline in a loop when the work amount is unknown. Don't make the inner pipeline a loop too.

5. **Model-route is at the top.** It's the only pattern that doesn't depend on the others. Apply it first to set the cost structure for everything below.

6. **Generate-filter and tournament are mutually exclusive for the final step.** Generate-filter produces an unranked shortlist; tournament produces a ranked list. If the user wants both, generate-filter first, then tournament on the shortlist.

7. **Classify-and-act is rare as a primary pattern.** It's usually a sub-step inside another pattern (the "decide what kind of X" step). Don't compose it as the outer wrapper unless the user explicitly says "first figure out what kind of X we're dealing with."

## The article's own example (verified)

Thariq's `/deep-research` is a 4-pattern composition:

```
model-route (cheap searches, expensive synthesis)
  → fan-out (one agent per search angle)
    → adversarial-verify (cross-check sources against each other)
      → synthesize (cited report)
```

If the user asks "set up something like `/deep-research` but for X," start with this stack and swap the search sources.
