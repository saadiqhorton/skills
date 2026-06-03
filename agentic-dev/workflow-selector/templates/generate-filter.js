// ESM module wrapper for the Claude Code dynamic workflow runtime.
// Replace USER_* constants with your values before running.

export default async function workflow() {
// Pattern 5: generate-filter
// Brainstorm many, dedupe, filter by rubric, keep top K.

const TOPIC = "USER_TOPIC_HERE";        // e.g. "names for a CLI tool that does X"
const RUBRIC = "RUBRIC_HERE";            // e.g. "short, memorable, available on npm"
const K = 5;                              // how many to keep
const N_GENERATORS = 5;                   // agents brainstorming in parallel
const N_PER_GENERATOR = 10;               // ideas per agent

// Step 1: Generate in parallel
const all = (await Promise.all(
  Array.from({length: N_GENERATORS}, (_, i) =>
    spawn_agent({
      prompt: `Brainstorm ${N_PER_GENERATOR} ideas for: ${TOPIC}. Return as JSON array.`,
      model: "sonnet",
    })
  )
)).flatMap(r => r.ideas);

// Step 2: Dedupe
const deduped = [...new Set(all)];

// Step 3: Filter by rubric
const scored = await Promise.all(
  deduped.map(idea => spawn_agent({
    prompt: `Score this idea against the rubric.\n\nRubric: ${RUBRIC}\n\nIdea: ${idea}\n\nReturn JSON: {idea, score: 0-10, reasoning}`,
    model: "sonnet",
  }))
);

// Step 4: Keep top K
const top = scored.sort((a, b) => b.score - a.score).slice(0, K);

return { topic: TOPIC, rubric: RUBRIC, total_generated: all.length, top };

}
