// ESM module wrapper for the Claude Code dynamic workflow runtime.
// Replace USER_* constants with your values before running.

export default async function workflow() {
// Pattern 6: model-route
// Classifier decides which model handles each unit.
// The classifier MUST be cheap or you lose the savings.

const UNITS = ["unit_a", "unit_b"]; // replace with your units
const CLASSIFIER_PROMPT = "Is this task easy (Sonnet is fine) or hard (needs Opus)? Return JSON: {complexity: 'easy' | 'hard', reasoning}";

const routed = await Promise.all(
  UNITS.map(async unit => {
    const classification = await spawn_agent({
      prompt: `${CLASSIFIER_PROMPT}\n\nUnit: ${JSON.stringify(unit)}`,
      model: "haiku", // CHEAP classifier
    });

    const executor_model = classification.complexity === "hard" ? "opus" : "sonnet";
    const result = await spawn_agent({
      prompt: `Process this unit: ${JSON.stringify(unit)}`,
      model: executor_model,
    });

    return { unit, classified_as: classification.complexity, model_used: executor_model, result };
  })
);

return { total: UNITS.length, by_complexity: routed };

}
