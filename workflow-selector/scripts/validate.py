#!/usr/bin/env python3
"""Validate the workflow-selector skill: SKILL.md frontmatter, references, templates.

Run: python3 scripts/validate.py
Exit: 0 if all checks pass, 1 otherwise.
"""
import json
import re
import sys
from pathlib import Path

SKILL_DIR = Path(__file__).parent.parent

def fail(msg):
    print(f"❌ {msg}")
    return 1

def ok(msg):
    print(f"✅ {msg}")
    return 0

def main():
    errors = 0

    # 1. SKILL.md exists
    skill_md = SKILL_DIR / "SKILL.md"
    if not skill_md.exists():
        return fail("SKILL.md missing")

    content = skill_md.read_text()
    errors += ok("SKILL.md exists")

    # 2. YAML frontmatter present
    fm_match = re.match(r"^---\n(.*?)\n---\n", content, re.DOTALL)
    if not fm_match:
        errors += fail("SKILL.md missing YAML frontmatter")
        return errors
    errors += ok("YAML frontmatter present")

    # 3. Required frontmatter fields
    fm = fm_match.group(1)
    if "name:" not in fm:
        errors += fail("frontmatter missing 'name'")
    else:
        errors += ok("frontmatter has 'name'")
    if "description:" not in fm:
        errors += fail("frontmatter missing 'description'")
    else:
        errors += ok("frontmatter has 'description'")

    # 4. Description is reasonably long (Claude Code uses this for skill matching)
    desc_match = re.search(r"description:\s*(.+?)(?=\n[a-z]+:|\Z)", fm, re.DOTALL)
    if desc_match and len(desc_match.group(1).strip()) < 50:
        errors += fail("description is too short (needs > 50 chars for skill matching)")
    elif desc_match:
        errors += ok(f"description length: {len(desc_match.group(1).strip())} chars")

    # 5. References folder has expected files
    ref_dir = SKILL_DIR / "references"
    if not ref_dir.exists():
        errors += fail("references/ folder missing")
    else:
        expected = ["pattern-rubric.md", "composition-cheatsheet.md", "examples.md"]
        for f in expected:
            if not (ref_dir / f).exists():
                errors += fail(f"references/{f} missing")
            else:
                errors += ok(f"references/{f} present")

    # 6. Templates folder has all 7 pattern templates + 3 composition templates
    tmpl_dir = SKILL_DIR / "templates"
    if not tmpl_dir.exists():
        errors += fail("templates/ folder missing")
    else:
        expected = [
            "classify-and-act.js",
            "fan-out-synthesize.js",
            "adversarial-verify.js",
            "generate-filter.js",
            "tournament.js",
            "loop-until-done.js",
            "model-route.js",
            "refactor-fleet.js",
            "claim-verifier.js",
            "session-rule-miner.js",
        ]
        for f in expected:
            if not (tmpl_dir / f).exists():
                errors += fail(f"templates/{f} missing")
            else:
                errors += ok(f"templates/{f} present")

    # 7. All templates have at least one plug-point marker (proves they're templates, not finished scripts)
    if tmpl_dir.exists():
        KNOWN_MARKERS = [
            "USER_TASK", "USER_TOPIC", "USER_DOC",     # generic task placeholders
            "RUBRIC", "ITEMS", "TOPIC", "TASK",        # pattern-specific config
            "SESSION_GLOB", "TRANSFORM", "FILES",      # composition configs
            "UNITS", "SOURCES",                        # model-route / loop-until-done
        ]
        for f in tmpl_dir.iterdir():
            if f.suffix == ".js":
                text = f.read_text()
                hits = [m for m in KNOWN_MARKERS if m in text]
                if not hits:
                    errors += fail(f"templates/{f.name} has NO plug-point markers (e.g. USER_TASK, RUBRIC)")
                else:
                    errors += ok(f"templates/{f.name} has plug-point markers: {', '.join(hits[:3])}")

    # 8. All JS templates are valid syntax
    if tmpl_dir.exists():
        import subprocess
        for f in tmpl_dir.iterdir():
            if f.suffix == ".js":
                r = subprocess.run(
                    ["node", "--check", str(f)],
                    capture_output=True, text=True
                )
                if r.returncode != 0:
                    errors += fail(f"templates/{f.name} syntax error: {r.stderr.strip()}")
                else:
                    errors += ok(f"templates/{f.name} syntax valid")

    # 9. SKILL.md mentions all 7 patterns
    patterns = [
        "classify-and-act", "fan-out", "adversarial-verify",
        "generate-filter", "tournament", "loop-until-done", "model-route"
    ]
    for p in patterns:
        if p in content:
            errors += ok(f"SKILL.md mentions pattern: {p}")
        else:
            errors += fail(f"SKILL.md missing pattern: {p}")

    # 10. SKILL.md documents the /goal and /loop modifiers
    for modifier in ["/goal", "/loop"]:
        if modifier in content:
            errors += ok(f"SKILL.md documents modifier: {modifier}")
        else:
            errors += fail(f"SKILL.md missing modifier docs: {modifier}")

    # 11. Examples file uses the modifiers in its paste blocks
    examples_path = SKILL_DIR / "references" / "examples.md"
    if examples_path.exists():
        ex = examples_path.read_text()
        for modifier in ["/goal", "/loop"]:
            count = ex.count(modifier)
            if count >= 2:
                errors += ok(f"examples.md uses {modifier} {count}x")
            else:
                errors += fail(f"examples.md should use {modifier} in >=2 places (found {count})")

    # 12. Cheatsheet has a Modifiers column populated
    cheatsheet_path = SKILL_DIR / "references" / "composition-cheatsheet.md"
    if cheatsheet_path.exists():
        cs = cheatsheet_path.read_text()
        if "/goal" in cs and "/loop" in cs:
            errors += ok("cheatsheet has Modifiers column with /goal and /loop")
        else:
            errors += fail("cheatsheet missing /goal or /loop in Modifiers column")

    print()
    if errors:
        print(f"❌ {errors} check(s) failed")
        return 1
    else:
        print("✅ All checks passed")
        return 0

if __name__ == "__main__":
    sys.exit(main())
