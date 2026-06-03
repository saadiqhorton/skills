// ESM module wrapper for the Claude Code dynamic workflow runtime.
// Replace USER_* constants with your values before running.

export default async function workflow() {
// Pattern 2: adversarial-verify
// The producer and verifier must be different agents (anti-self-bias).
// Replace TASK, RUBRIC, N with your values.

const TASK = "USER_TASK_HERE";
const RUBRIC = "RUBRIC_HERE";            // e.g. "Would this rule have prevented a real mistake I made?"
const N = 5;                             // number of candidates to verify

// Step 1: Produce N candidates
const candidates = await Promise.all(
  Array.from({length: N}, (_, i) => spawn_agent({
    prompt: `Generate candidate #${i+1} for: ${TASK}`,
    model: "sonnet",
  }))
);

// Step 2: Each candidate is verified by a SEPARATE agent against the rubric
const verified = await Promise.all(
  candidates.map((c, i) => spawn_agent({
    prompt: `Verify this candidate against the rubric.\n\nRubric: ${RUBRIC}\n\nCandidate: ${JSON.stringify(c)}\n\nReturn JSON: {candidate_id, passes: bool, reasoning, issues: []}`,
    model: "sonnet",  // different model from producer also possible
  }))
);

// Step 3: Surviving candidates
const survivors = verified.filter(v => v.passes);

return {
  task: TASK,
  rubric: RUBRIC,
  total_candidates: candidates.length,
  survivors: survivors.length,
  results: verified,
};

}
