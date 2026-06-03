// ESM module wrapper for the Claude Code dynamic workflow runtime.
// Replace USER_* constants with your values before running.

export default async function workflow() {
// Pattern 3: tournament
// Pairwise comparison is more reliable than absolute scoring.
// Deterministic loop holds the bracket, only running order stays in context.

const ITEMS = ["item_a", "item_b", "item_c", "item_d"]; // replace with your items
const RUBRIC = "RUBRIC_HERE"; // e.g. "which name better fits a CLI tool for X"

// Initial seeding: optionally do a first pass to get top-K
let bracket = [...ITEMS];

while (bracket.length > 1) {
  const next_round = [];
  for (let i = 0; i < bracket.length; i += 2) {
    if (i + 1 >= bracket.length) {
      next_round.push(bracket[i]); // bye
      continue;
    }
    const a = bracket[i], b = bracket[i + 1];
    const result = await spawn_agent({
      prompt: `Compare these two against the rubric. Pick the winner.\n\nRubric: ${RUBRIC}\n\nA: ${JSON.stringify(a)}\nB: ${JSON.stringify(b)}\n\nReturn JSON: {winner: "A" | "B", reasoning}`,
      model: "sonnet",
    });
    next_round.push(result.winner === "A" ? a : b);
  }
  bracket = next_round;
}

return { winner: bracket[0], rubric: RUBRIC, items_tested: ITEMS.length };

}
