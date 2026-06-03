// ESM module wrapper for the Claude Code dynamic workflow runtime.
// Replace USER_* constants with your values before running.

export default async function workflow() {
// Pattern 1: fan-out-synthesize
// Replace USER_TASK, UNIT_TYPE, N with your values.

const TASK = "USER_TASK_HERE";          // e.g. "audit every API endpoint under src/routes/ for missing auth checks"
const UNIT_TYPE = "UNIT_TYPE_HERE";      // e.g. "API endpoint file" or "claim" or "session"
const N = 10;                            // number of units (cap 100)

const units = await discover_units(TASK, UNIT_TYPE, N);
console.log(`Found ${units.length} ${UNIT_TYPE}s`);

const results = await Promise.all(
  units.map(unit => spawn_agent({
    prompt: `Process this ${UNIT_TYPE}: ${JSON.stringify(unit)}\n\nGoal: ${TASK}\n\nReturn JSON: {id, finding, severity, evidence}`,
    model: "sonnet",
  }))
);

const failures = results.filter(r => r.severity !== "ok");
const report = synthesize_report({
  task: TASK,
  unit_type: UNIT_TYPE,
  total: units.length,
  findings: results,
  summary: `Found ${failures.length} issues across ${units.length} ${UNIT_TYPE}s.`,
});

return report;

}
