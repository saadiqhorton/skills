// ESM module wrapper for the Claude Code dynamic workflow runtime.
// Replace USER_* constants with your values before running.

export default async function workflow() {
// Composition: session-rule-miner
// Pattern stack: loop-until-done (mine) + generate-filter (cluster) + adversarial-verify (would-this-rule-have-prevented-it?) + write
// Article use case: "go through my last 50 sessions and turn recurring corrections into CLAUDE.md rules"

const SESSION_GLOB = "~/.claude/sessions/*.jsonl";
const OUTPUT = "~/.claude/CLAUDE.md";
const N_SESSIONS = 50;
const TOKEN_BUDGET = 10000; // article: "you can prompt it with a budget like 'use 10k tokens'"

// Step 1: Mine sessions
const session_paths = await list_files(SESSION_GLOB, { limit: N_SESSIONS });

const corrections = (await Promise.all(
  session_paths.map(p => spawn_agent({
    prompt: `Read this session log. Extract every correction the user made to Claude (e.g. "don't do X", "actually use Y", "no, that's wrong"). Return JSON: {corrections: [{text, context}]}`,
    model: "sonnet",
  }))
)).flatMap(r => r.corrections);

console.log(`Found ${corrections.length} corrections across ${session_paths.length} sessions`);

// Step 2: Cluster by similarity
const clusters = await spawn_agent({
  prompt: `Cluster these corrections by similarity. Recurring corrections go in the same cluster. Return JSON: {clusters: [{theme, corrections: []}]}\n\nCorrections: ${JSON.stringify(corrections)}`,
  model: "sonnet",
});

// Step 3: For each cluster, generate a candidate rule and adversarially verify
const rules = await Promise.all(
  clusters.clusters.map(async cluster => {
    const candidate = await spawn_agent({
      prompt: `Write a CLAUDE.md rule from this cluster.\n\nCluster: ${JSON.stringify(cluster)}\n\nReturn JSON: {rule: string, rationale}`,
      model: "sonnet",
    });

    const verification = await spawn_agent({
      prompt: `Would this rule have prevented a real mistake?\n\nRule: ${candidate.rule}\nOriginal corrections: ${JSON.stringify(cluster.corrections)}\n\nBe skeptical. If the rule is too vague, redundant with existing rules, or wouldn't actually catch the mistake, fail it. Return JSON: {passes: bool, reasoning}`,
      model: "sonnet",
    });

    return { ...candidate, verification };
  })
);

const survivors = rules.filter(r => r.verification.passes);

// Step 4: Write to CLAUDE.md
const existing = await read_file(OUTPUT);
const new_rules_section = `## Rules mined from ${session_paths.length} sessions on ${new Date().toISOString().split('T')[0]}\n\n${survivors.map(r => `- ${r.rule}\n  Rationale: ${r.rationale}`).join("\n")}`;

await write_file(OUTPUT, existing + "\n\n" + new_rules_section);

return {
  sessions_mined: session_paths.length,
  corrections_found: corrections.length,
  clusters: clusters.clusters.length,
  rules_surviving: survivors.length,
  output: OUTPUT,
};

}
