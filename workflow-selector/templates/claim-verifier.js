// ESM module wrapper for the Claude Code dynamic workflow runtime.
// Replace USER_* constants with your values before running.

export default async function workflow() {
// Composition: claim-verifier
// Pattern stack: fan-out (1/claim) + adversarial-verify (source quality) + synth
// Article use case: "verify every technical claim in a blog post draft against the codebase"

const DOC = "USER_DOC_PATH_HERE"; // e.g. "drafts/blog-post.md"

// Step 1: Extract claims
const claims = await spawn_agent({
  prompt: `Extract every technical/factual claim from this document. Return JSON: {claims: [{id, text, type: 'code' | 'external' | 'factual'}]}\n\nDoc: ${DOC}`,
  model: "sonnet",
});

console.log(`Extracted ${claims.claims.length} claims`);

// Step 2: Verify each claim in parallel
const verified = await Promise.all(
  claims.claims.map(c => spawn_agent({
    prompt: `Verify this claim.\n\nClaim: ${c.text}\nType: ${c.type}\n\n${c.type === 'code' ? 'Search the codebase for the relevant code. Check if the claim is accurate.' : 'Find a primary source. Quote it.'}\n\nReturn JSON: {claim_id, verdict: 'confirmed' | 'refuted' | 'insufficient', evidence, source_url, source_quality: 'primary' | 'secondary' | 'tertiary'}`,
    model: "sonnet",
  }))
);

// Step 3: Source quality check by separate agent
const with_quality = await Promise.all(
  verified.map(v => spawn_agent({
    prompt: `Assess source quality for this verification.\n\nVerification: ${JSON.stringify(v)}\n\nIs the source primary (official docs, code, first-party) or secondary (blog, third-party)? Could a better source exist? Return JSON: {claim_id, source_quality, recommended_better_source}`,
    model: "sonnet",
  }))
);

// Step 4: Synthesize verdict table
return {
  doc: DOC,
  total_claims: claims.claims.length,
  by_verdict: {
    confirmed: with_quality.filter(v => v.verdict === "confirmed").length,
    refuted: with_quality.filter(v => v.verdict === "refuted").length,
    insufficient: with_quality.filter(v => v.verdict === "insufficient").length,
  },
  table: with_quality,
};

}
