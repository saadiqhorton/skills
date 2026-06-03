# Worked Examples

Real prompts from Thariq's article, classified and templated. Use these as the canonical examples when training yourself or showing the user.

Every example below includes both the pattern stack **and the recommended modifier** (`/goal`, `/loop`, or both) when applicable. The article's authors default to `/goal` for completeness-bound tasks and `/loop` for continuous ones.

---

## Example 1: "This test fails maybe 1 in 50 runs. Set up a workflow to reproduce it, form theories and adversarially test them in worktrees. /goal don't stop until one theory works."

**Classification:**
- Work amount unknown → loop-until-done
- Multiple competing theories → disjoint hypotheses
- Each theory needs adversarial testing → adversarial-verify (verifier + refuter)
- User said /goal → hard completion requirement

**Stack:** loop-until-done (outer) + disjoint-evidence-agents (theories) + adversarial-verify (test each)
**Modifier:** `/goal: one theory confirmed and reproduced`

**Paste:**
```
ultracode: This test fails ~1/50 runs. Reproduce it, form theories from disjoint evidence (logs / git / files / data), adversarially test each theory in worktrees /goal: don't stop until one theory is confirmed and reproduced.
```

**Expected outcome:** A confirmed root cause with reproduction steps and a fix. Runtime: 20-40 min depending on how many theories.

---

## Example 2: "Using a workflow, go through my last 50 sessions and mine them for corrections I keep making and turn the recurring ones into CLAUDE.md rules."

**Classification:**
- N=50 sessions → fan-out
- Want recurring rules → generate-filter (cluster the corrections)
- Each rule needs to be validated → adversarial-verify (would this rule have prevented a real mistake?)

**Stack:** fan-out (1/session) → generate-filter (cluster) → adversarial-verify (each rule) → write to CLAUDE.md
**Modifier:** `/goal: at least 3 surviving rules`

**Paste:**
```
ultracode: Mine my last 50 sessions for corrections I keep making. Cluster them. For each candidate rule, verify adversarially that it would have prevented a real mistake I made. Write the surviving rules to ~/.claude/CLAUDE.md. /goal: at least 3 surviving rules.
```

**Watch for:** Runtime will probably hit 30+ min on 50 sessions. If so, batch into 25 at a time.

---

## Example 3: "Use a workflow to dig through #incidents in Slack for the past six months and find recurring root causes where nobody has filed a ticket."

**Classification:**
- Work amount unknown (don't know how many recurring issues) → loop-until-done
- Need to find recurring patterns → generate-filter (cluster)
- Each pattern needs verification → adversarial-verify

**Stack:** loop-until-done (mine) → generate-filter (cluster) → adversarial-verify (real root cause) → synth
**Modifier:** `/goal: at least 5 verified patterns /loop every 1d` (run daily to catch new incidents)

**Paste:**
```
ultracode: Mine #incidents in Slack for the past 6 months. Find recurring root causes where no ticket exists. Cluster the findings, adversarially verify each cluster is a real recurring root cause, and stop when no new findings emerge in 2 consecutive loops. /goal: at least 5 verified patterns /loop every 1d.
```

---

## Example 4: "Take my business plan and run a workflow where different agents tear it apart from an investor's, a customer's, and a competitor's perspective."

**Classification:**
- 3 independent angles → fan-out (3 perspectives)
- Each angle should be cross-checked → adversarial-verify (each angle by the other 2)
- Synthesis at end → standard fan-out synth

**Stack:** fan-out (3 perspectives) + adversarial-verify (cross-check) → synth
**Modifier:** none (single-pass, bounded)

**Paste:**
```
ultracode: Tear apart my business plan from 3 angles: an investor's, a customer's, and a competitor's. Each agent writes a critique. Then have each critique reviewed by the other 2 agents. Synthesize the surviving concerns into a single risk list.
```

---

## Example 5: "Here's a folder of 80 resumes, use a workflow to rank them for the backend role and double-check the top ten. Interview me using the AskUserQuestion tool for a rubric."

**Classification:**
- 80 items → fan-out (initial scoring)
- Need ranking → tournament on top 10
- Top 10 need double-check → adversarial-verify
- User wants to define rubric → classify-and-act sub-step (gather rubric first)

**Stack:** classify-and-act (gather rubric) + fan-out (score 80) + tournament (top 10) + adversarial-verify (top 3)
**Modifier:** none (one-shot, bounded by 80 resumes)

**Paste:**
```
ultracode: First, ask me a rubric for ranking backend candidates (use AskUserQuestion). Then score 80 resumes against it. Tournament-rank the top 10 pairwise. Adversarially verify the top 3. Return the final ranking with the rubric, scores, and verification notes.
```

---

## Example 6: "I need a name for this CLI tool. Use a workflow to brainstorm a bunch of options and run a tournament to pick the top 3."

**Classification:**
- Brainstorm → generate-filter (or just fan-out for breadth)
- Pick top 3 → tournament

**Stack:** generate-filter (brainstorm 20-30) + tournament (top 3)
**Modifier:** none (bounded, "top 3" is the implicit goal)

**Paste:**
```
ultracode: Brainstorm 25 names for this CLI tool. Run a tournament to pick the top 3 by pairwise judgment. Return the top 3 with the bracket and why each won.
```

---

## Example 7: "Use a workflow to rename our User model to Account everywhere."

**Classification:**
- N files, all need same treatment → fan-out
- Each change needs review → adversarial-verify
- Cross-cutting refactor → worktree isolation per file

**Stack:** fan-out (1/file in worktree) + adversarial-verify (reviewer per change) + gate-merge
**Modifier:** `/goal: all files updated and tests pass`

**Paste:**
```
ultracode: Rename the User model to Account everywhere in this codebase. One agent per file in its own worktree. A reviewer agent checks each change against the type system and call sites. Only merge reviewer-passed changes. Run tests after each merge. /goal: all files renamed and tests pass.
```

**Watch for:** This will burn tokens. Set a token budget. The article says: *"Consider telling the agent not to use resource intensive commands so that you can maximally parallelize without running out of resources on your machine."*

---

## Example 8: "Go through my blog post draft and using a workflow verify every technical claim against the codebase, I don't want to ship anything wrong."

**Classification:**
- N claims → fan-out
- Each claim needs verification → adversarial-verify
- Source quality check (primary vs. secondary) → second adversarial pass

**Stack:** fan-out (1/claim) + adversarial-verify (claim against codebase) + adversarial-verify (source quality) + synth
**Modifier:** `/goal: verify all N claims`

**Paste:**
```
ultracode: Read my blog post draft. Extract every technical claim. For each claim, spawn a subagent to verify it against the codebase. A second subagent checks the quality of the source the verifier used. Return a verdict table: claim | source path | source quality | verdict. /goal: every claim is verified or flagged as un-verifiable.
```

**Variations:**
- If the draft references external libraries, swap "codebase" for "official docs" (use WebFetch + WebSearch).
- For a paper or article, swap for "primary sources cited in the bibliography."

---

## Modifier-only examples (no pattern change, just a modifier swap)

Same pattern, different modifier — for when the user describes the *same kind of work* but with a different cadence or rigor.

**One-shot** (default):
```
ultracode: audit every API endpoint under src/routes/ for missing auth checks
```

**One-shot, hard completion bar:**
```
ultracode: audit every API endpoint under src/routes/ for missing auth checks /goal: every endpoint checked, no skipped files
```

**Continuous monitoring:**
```
ultracode: audit new commits in src/routes/ for missing auth checks /loop every 1h
```

**Continuous + completion bar (cost warning applies):**
```
ultracode: process the support queue /loop every 30m /goal: every open ticket is classified, deduped, and either fixed or escalated
```

**Time-boxed (use when 50min cap is a worry):**
```
ultracode: verify the top 20 claims in this doc /goal: all 20 verified, time-boxed to 30min
```
