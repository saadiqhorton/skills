// ESM module wrapper for the Claude Code dynamic workflow runtime.
// Replace USER_* constants with your values before running.

export default async function workflow() {
// Pattern 6: loop-until-done
// Stop when the signal fires. Pair with /loop for continuous runs.

const SIGNAL = "no new findings in 2 consecutive loops";
const MAX_LOOPS = 20;                    // hard cap
const MAX_MINUTES = 45;                  // runtime cap (article: 50 min max)
const TASK = "USER_TASK_HERE";           // e.g. "find recurring root causes in #incidents"
const SOURCES = ["logs", "git", "files", "data"]; // replace with your evidence sources

const start = Date.now();
const seen = new Set();
let consecutive_no_new = 0;
let loop_count = 0;
const all_findings = [];

while (consecutive_no_new < 2 && loop_count < MAX_LOOPS) {
  if ((Date.now() - start) / 60000 > MAX_MINUTES) {
    console.log("Hit max runtime, stopping.");
    break;
  }
  loop_count++;

  // Spawn mining agents (one per evidence source)
  const new_findings = await Promise.all(
    SOURCES.map(source => spawn_agent({
      prompt: `Mine ${source} for new findings related to: ${TASK}`,
      model: "sonnet",
    }))
  );

  // Dedup against seen
  const fresh = new_findings.filter(f => !seen.has(f.id));
  fresh.forEach(f => seen.add(f.id));
  all_findings.push(...fresh);

  consecutive_no_new = fresh.length === 0 ? consecutive_no_new + 1 : 0;
  console.log(`Loop ${loop_count}: ${fresh.length} new findings, ${all_findings.length} total`);
}

return {
  total_loops: loop_count,
  total_findings: all_findings.length,
  stop_signal: SIGNAL,
  task: TASK,
  findings: all_findings,
};

}
