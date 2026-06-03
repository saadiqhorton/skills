// ESM module wrapper for the Claude Code dynamic workflow runtime.
// Replace USER_* constants with your values before running.

export default async function workflow() {
// Pattern 7: classify-and-act
// First classify, then route to specialist agents.

const TASK = "USER_TASK_HERE";
const TYPES = ["type_a", "type_b", "type_c"]; // replace with your types
const TYPE_DESCRIPTIONS = {
  type_a: "Description of what type A means",
  type_b: "Description of what type B means",
  type_c: "Description of what type C means",
};

// Step 1: Classify
const classification = await spawn_agent({
  prompt: `Classify this task into one of: ${TYPES.join(", ")}.\n\nType meanings: ${JSON.stringify(TYPE_DESCRIPTIONS)}\n\nTask: ${TASK}\n\nReturn JSON: {type, reasoning}`,
  model: "sonnet",
});

const chosen_type = classification.type;

// Step 2: Route to specialist
const specialist_prompts = {
  type_a: "Specialist A prompt template",
  type_b: "Specialist B prompt template",
  type_c: "Specialist C prompt template",
};

const result = await spawn_agent({
  prompt: `${specialist_prompts[chosen_type]}\n\nTask: ${TASK}`,
  model: "opus", // specialist can be expensive
});

return { task: TASK, classified_as: chosen_type, reasoning: classification.reasoning, result };

}
