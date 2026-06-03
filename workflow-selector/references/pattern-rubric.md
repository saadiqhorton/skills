# Pattern Rubric — The Classifier

The 7 patterns, with the exact signals that match each. Read this when you need to disambiguate or compose.

## 1. classify-and-act

**Signal words:** "decide what kind of X this is", "route to", "pick the right", "based on what type"

**Shape:**
```
classifier_agent → [type_a_agent, type_b_agent, type_c_agent] → synth
```

**Use when:** The first step is figuring out what you're dealing with, and the action depends on the type. Different types want different specialists.

**Anti-pattern:** Don't use for tasks that are uniform — if every unit gets the same treatment, just fan-out.

**Token cost:** Low. 1 classifier + N specialists, but N is small (usually 2-5 types).

**Article quote:** *"Use a classifier agent to decide the type of task, and then route to different agents or behavior based on the task. Or, use a classifier at the end to determine output."*

## 2. fan-out-synthesize

**Signal words:** "go through all of", "every X", "for each Y", "all N files", "each claim", "every API endpoint"

**Shape:**
```
splitter → [agent_1, agent_2, ..., agent_N] → synthesizer
```

**Use when:** You have N independent units that all get the same shape of treatment, then one synthesis step. The work is parallelizable by construction.

**The synthesis step is the barrier** — the article is explicit: *"The synthesize step is a barrier — it waits for all the fan-out agents, then merges their structured outputs into one result."* Don't return results to the user piecemeal.

**Token cost:** Linear in N. Cap at 100 (runtime limit). For larger tasks, batch.

**Common modifier:** Almost always pairs with `/goal` to force all N units to be processed. Without `/goal`, agents may declare "done" after a partial pass.

**Article quote:** *"Split up a task into many smaller steps, run an agent on each step and then synthesize those results. This is particularly useful for when there are a large number of smaller steps, or when each step benefits from its own clean context window so they don't interfere or cross-contaminate."*

## 3. adversarial-verify

**Signal words:** "verify", "check", "rubric", "is this correct", "review", "QA"

**Shape:**
```
producer_agent → verifier_agent(s) → (pass | fail + reasoning)
```

**Use when:** Each output needs a separate agent to check it. The verifier is NOT the same agent that produced the work — that's the whole point (anti-self-bias).

**The verifier needs a rubric** — vague "is this good?" doesn't work. Specific criteria: "does this rule prevent the bug it claims to prevent?", "is this source primary or secondary?", "does this name follow the style guide?"

**Composable:** This is the most commonly composed pattern. Fan-out-synthesize + adversarial-verify on each output is the default quality pattern for the article's authors.

**Article quote:** *"For each spawned agent, run a separate spawned agent to adversarially verify its output against a rubric or criteria."*

## 4. generate-filter

**Signal words:** "brainstorm", "come up with", "list of options", "many ideas", "dedupe"

**Shape:**
```
generator (one or many) → dedupe → filter_by_rubric → top_K
```

**Use when:** You want diversity, then selection. Useful when you're exploring a design space (names, architectures, feature ideas) and the hard part is "which one" not "what are they."

**Token cost:** Higher than fan-out-synthesize — you generate more than you keep. But the filter is cheap.

**Anti-pattern:** Don't use for ranking — that's tournament. Generate-filter is "many → few," not "many → ordered."

**Article quote:** *"Generate a number of ideas on a topic and then filter them by a rubric or by verification, dedupe duplicates and return only the highest quality, tested ideas."*

## 5. tournament

**Signal words:** "rank", "best", "compare", "which one", "pick the top", "order these"

**Shape:**
```
[agent_a, agent_b, ...] → judge_pair(a, b) → winner advances
         ↓
   bracket continues until 1 winner
```

**Use when:** You need a ranked ordering, not just a "good vs. bad" filter. The article is unambiguous: **comparative judgment is more reliable than absolute scoring.** If you ask "rate this 1-10" you get noise. If you ask "is A or B better, and why" you get signal.

**The deterministic loop holds the bracket, only the running order stays in context.** This is the key efficiency trick. Token cost is O(N) for N items, not O(N^2).

**For 80 resumes:** initial fan-out gives you a top 10, then tournament pairwise on those 10 = 9 comparisons, then deep-dive verification on the winner.

**Article quote:** *"Spawn N agents that each attempt the same task using different approaches. Prompts or models then judge the results in a pairwise fashion using a judging agent until you have a winner."*

## 6. loop-until-done

**Signal words:** "keep going until", "find all", "until no new", "recurring", "I don't know how many"

**Shape:**
```
while (!stop_condition) {
  spawn_mining_agents()
  collect_findings()
  stop_condition = evaluate(new_findings)
}
```

**Use when:** The work amount is unknown and you stop on a signal, not a count. Common signals: "no new findings in last N runs", "no more errors in the log", "all open tickets triaged."

**Combine with `/loop`** — the article pairs these explicitly for triage work that should run continuously. `/loop every <interval>` re-runs the whole pipeline on a schedule; the inner `stop_condition` controls per-run termination.

**Watch out:** Can blow the 50-minute runtime cap if the stop condition is too lax. Build the stop condition to be reachable in 30-40 min on first run, then tune.

**Article quote:** *"For tasks with an unknown amount of work, loop spawning agents until a stop condition is met (no new findings, or no more errors in the logs) instead of a fixed number of passes."*

## 7. model-route

**Signal words:** "cheap model for X, expensive for Y", "Sonnet for the easy parts, Opus for the hard ones", "different models for different steps"

**Shape:**
```
classifier_agent → {Sonnet: easy_branch, Opus: hard_branch} → synth
```

**Use when:** The task has parts that genuinely need different model capability, and the cheap model can reliably tell which is which. A bad classifier wastes the saving.

**The classifier must be cheap** — if you're using Opus to decide whether to use Opus, you've gained nothing. Use Sonnet or Haiku for the routing decision.

**Anti-pattern:** Don't use just to save money on simple classification — that's not orchestration, that's config.

**Article quote (paraphrased):** *"A classifier agent can do this research and then route to Sonnet or Opus based on the expected complexity of the task."*

## Composition order (default)

When a task fits multiple patterns, apply them in this order:

1. **model-route** first (if heterogeneous models are useful) — saves tokens across all later steps
2. **classify-and-act** if the task starts with "what kind of X" — sets the type-aware specialist pipeline
3. **fan-out-synthesize** as the work backbone — most patterns compose onto this
4. **adversarial-verify** on each output by default — the article's quality pattern
5. **generate-filter** or **tournament** at the end if the final output is a selection or ranking
6. **loop-until-done** wrapping everything if the work amount is unknown

The article's authors use this exact composition for `/deep-research`:
- model-route (cheap searches, expensive synthesis)
- fan-out (one search per angle)
- adversarial-verify (cross-check sources against each other)
- synthesize (cited report)

## Modifier selection (orthogonal to pattern selection)

After picking the pattern stack, decide on `/goal` and `/loop`:

| Signal in the prompt | Add this modifier |
|---|---|
| "don't stop until", "make sure", "all N done", "until X is true" | `/goal "<completion bar>"` |
| "every hour", "continuously", "monitor", "watch for", "keep an eye on" | `/loop every <interval>` |
| Both of the above | `/goal + /loop` (warn the user about token cost) |
| Neither | No modifier (plain `ultracode:`) |

**Rule of thumb:** The article's authors default to `/goal` on fan-out-synthesize, adversarial-verify, and loop-until-done. They default to `/loop` on triage-style tasks. The default for everything else is no modifier.

## Decision tree (fast path)

```
Is the work amount unknown?          → loop-until-done (outer)
  ↓ no
Do you need a ranked output?         → tournament (or generate-filter if not ranked)
  ↓ no
Does each output need verification?  → fan-out-synthesize + adversarial-verify
  ↓ no
Do units need different treatment?   → classify-and-act
  ↓ no
Do parts need different models?      → model-route
  ↓ no
Just fan-out-synthesize.
```

If you reach "Just fan-out-synthesize" and the task has N<10, you don't need a workflow at all. Tell the user.

## Modifier decision tree (after pattern is chosen)

```
Is there a hard completion bar?      → add /goal "<specific bar>"
  ↓ no
Is the task recurring?               → add /loop every <interval>
  ↓ no
No modifiers.
```

The two decision trees are independent — pick pattern first, then modifiers.
