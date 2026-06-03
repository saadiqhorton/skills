// ESM module wrapper for the Claude Code dynamic workflow runtime.
// Replace USER_* constants with your values before running.

export default async function workflow() {
// Composition: refactor-fleet
// Pattern stack: fan-out (1/file in worktree) + adversarial-verify (reviewer per change) + gate-merge
// Article use case: "rename User to Account everywhere"

const TRANSFORM = "Replace all occurrences of `User` with `Account` in this file. Update imports, type annotations, call sites, and tests.";
const FILES = await discover_files("src/**/*.{ts,tsx,js,py}"); // replace with your glob

console.log(`Found ${FILES.length} files to transform`);

const changes = await Promise.all(
  FILES.map(async file => {
    // Each change happens in its own worktree
    const worktree = await create_worktree(file);
    try {
      const transformed = await spawn_agent({
        prompt: `${TRANSFORM}\n\nFile: ${file}\n\nReturn the new file content.`,
        model: "sonnet",
      });
      await worktree.write(file, transformed);

      // Adversarial reviewer checks the change
      const review = await spawn_agent({
        prompt: `Review this change for correctness.\n\nFile: ${file}\n\nCheck: type system, call sites updated, no broken imports, no missed references. Return JSON: {passes: bool, issues: []}`,
        model: "sonnet",
      });

      if (review.passes) {
        return worktree.commit();
      } else {
        return { file, status: "rejected", issues: review.issues };
      }
    } finally {
      await worktree.cleanup();
    }
  })
);

const merged = changes.filter(c => c.status === "merged" || c.commit);
const rejected = changes.filter(c => c.status === "rejected");

// Final integration check
const integration = await spawn_agent({
  prompt: `Run the test suite. Report any failures with the file and reason.`,
  model: "sonnet",
});

return {
  files_changed: merged.length,
  files_rejected: rejected.length,
  integration,
};

}
