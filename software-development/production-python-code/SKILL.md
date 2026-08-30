---
name: production-python-code
description: Write, review, and refactor production-grade Python using eight design principles — cohesion/SRP, encapsulation/abstraction, loose coupling/modularity, reusability/extensibility (Open/Closed), portability, defensibility (fail-fast, least privilege, safe defaults), maintainability/testability, and simplicity (KISS/DRY/YAGNI). Use when writing new Python classes or modules, reviewing a Python change for production readiness, refactoring legacy Python, or answering "is this ready for production" questions. Comes with verified references and runnable bad→good examples for every principle.
---

# Production Python Code

Write Python that is ready for production: cohesive, encapsulated, loosely
coupled, extensible, portable, defensive, testable, and simple. This skill is
the agent-facing wrapper for the teaching repo in `examples/` — every principle
has a runnable **bad → good** pair you can inspect, run, and use as a refactor
target.

## When to use

- Writing any new Python module, class, or function that will outlive a scratch script.
- Reviewing Python code for production readiness (not just "does it run").
- Refactoring legacy, spaghetti, or single-file-everything Python.
- Auditing a codebase with "is this production-ready?" as the bar.
- Answering questions about SOLID, design principles, or Python best practices.

## The eight principles (at a glance)

| # | Principle | One-sentence rule | Ask yourself | Runnable demo |
|---|-----------|-------------------|--------------|---------------|
| 1 | Cohesion & SRP | One class, one reason to change | "Can I describe this class's purpose in one sentence without 'and'?" | `examples/01_cohesion_srp/` |
| 2 | Encapsulation & Abstraction | Hide internals, expose behavior | "If I change internal implementation, will client code break?" | `examples/02_encapsulation_abstraction/` |
| 3 | Loose Coupling & Modularity | Depend on abstractions, inject dependencies | "Can I test this without instantiating half my system?" | `examples/03_loose_coupling_modularity/` |
| 4 | Reusability & Extensibility | Open for extension, closed for modification | "Can I add functionality without editing existing code?" | `examples/04_reusability_extensibility/` |
| 5 | Portability | Write once, run anywhere | "Will this work on Linux, Windows, and Mac?" | `examples/05_portability/` |
| 6 | Defensibility | Fail fast, fail safe, fail loud | "What's the worst that could happen with bad input?" | `examples/06_defensibility/` |
| 7 | Maintainability & Testability | Future-you thanks present-you | "Can I unit-test this without mocking 5 things?" | `examples/07_maintainability_testability/` |
| 8 | Simplicity (KISS / DRY / YAGNI) | Simple, no repetition, only what's needed now | "Am I making this more complex than it needs to be?" | `examples/08_simplicity_kiss_dry_yagni/` |

Full detail for each principle: [references/design-principles.md](references/design-principles.md).

## Workflow: writing new production code

Apply this checklist before considering code done. Each item is the *good*
side of one of the runnable examples.

1. **SRP/cohesion** — Split the work into classes with one job each; orchestration
   lives in a thin coordinator (see `good_user_manager.py`). If a class needs
   "and" to describe itself, split it.
2. **Encapsulation/abstraction** — Private-by-convention state (`_name`), public
   methods only for behavior, validation inside the class, read-only views return
   copies (`good_bank_account.py`).
3. **Loose coupling/modularity** — Define an `ABC`/`Protocol` for collaborators,
   inject them through the constructor, never `new`-up dependencies inside a class
   that uses them (`good_notification/`).
4. **Extensibility** — Replace type-dispatch `if/elif` with Strategy/plugin
   objects behind one interface so new variants are new classes, not edits
   (`good_report.py`). Do not over-apply to trivial cases (see #8).
5. **Portability** — `pathlib.Path` for all paths, `os.getenv`/config for every
   environment-dependent value, no hard-coded separators or machine paths
   (`good_file_handler.py`).
6. **Defensibility** — Validate all inputs at the boundary and fail fast with
   clear exceptions; safe defaults (`debug=False`, bounded retries, explicit
   timeouts); never store/log secrets; mask or truncate sensitive data
   (`good_payment.py`).
7. **Testability** — Keep computation pure and separate from I/O; put business
   logic in functions/classes that need no mocks; ship tests that exercise edge
   cases (`good_calculator/` + `test_calculator.py`).
8. **Simplicity** — Use the simplest construct that works (functions over
   factory classes for one-liners), extract repeated logic once, and add no
   features for hypothetical futures (`good_string_utils.py`).

## Workflow: reviewing code

For each principle, give PASS / FAIL with evidence, then list the concrete fix.

```text
1. SRP/cohesion       PASS/FAIL — one clear responsibility per class?
2. Encapsulation      PASS/FAIL — no public mutable internals, no leaked state?
3. Coupling/modularity PASS/FAIL — abstractions injected, no internal new-ing?
4. Extensibility      PASS/FAIL — new variants possible without editing existing code?
5. Portability        PASS/FAIL — pathlib + env config, no platform assumptions?
6. Defensibility      PASS/FAIL — inputs validated, fail-fast, safe defaults, no secret logging?
7. Testability        PASS/FAIL — pure logic separated from I/O, tests included?
8. Simplicity         PASS/FAIL — no over-engineering, no duplication, no YAGNI features?
```

For FAIL items, name the fix and cite the matching good example above. The
smells table maps symptoms → principle → fix:
[references/code-smells-and-fixes.md](references/code-smells-and-fixes.md).

## Workflow: refactoring legacy code

1. Run the code's tests (or write a smoke test) to lock in behavior.
2. Walk the decision tree in [references/code-smells-and-fixes.md](references/code-smells-and-fixes.md).
3. For each smell, apply the corresponding `examples/<module>/good_*.py` pattern.
4. Re-run tests after every principle-level change; keep changes behavior-preserving.
5. Do not over-refactor: principles 1–4 and 8 pull against each other — prefer the
   simplest design that still satisfies the others. See
   [references/verified-sources.md](references/verified-sources.md) for the OCP/YAGNI debate.

## Python-specific best practices

Quick list — details and code snippets in [references/python-specifics.md](references/python-specifics.md).

- `pathlib.Path` over `os.path` string surgery.
- Type hints (PEP 484) on public function/class signatures.
- `@dataclass` for data containers; `frozen=True` for immutable results.
- `abc.ABC` + `@abstractmethod` (or `typing.Protocol`) for interfaces.
- Context managers (`with`) for resources — never manual `open/close`.
- Environment variables with safe defaults for configuration; never hard-code paths/endpoints.
- `decimal.Decimal` for money; never floats.
- Pure functions + separated I/O for testability; unittest or pytest on the pure core.
- Validate at boundaries and raise specific exceptions; never `except: pass`.
- Least privilege: log/store only what is necessary; mask card/PII data.

## Run the examples (verification)

All examples are runnable; each prints its bad/good lessons:

```bash
cd examples
python3 01_cohesion_srp/bad_user_manager.py && python3 01_cohesion_srp/good_user_manager.py
python3 02_encapsulation_abstraction/bad_bank_account.py && python3 02_encapsulation_abstraction/good_bank_account.py
python3 03_loose_coupling_modularity/bad_notification.py && python3 03_loose_coupling_modularity/good_notification/main.py
python3 04_reusability_extensibility/bad_report.py && python3 04_reusability_extensibility/good_report.py
python3 05_portability/bad_file_handler.py && python3 05_portability/good_file_handler.py
python3 06_defensibility/bad_payment.py && python3 06_defensibility/good_payment.py
python3 07_maintainability_testability/bad_calculator.py && python3 07_maintainability_testability/good_calculator/calculator.py
python3 07_maintainability_testability/good_calculator/test_calculator.py   # runs the full test suite
python3 08_simplicity_kiss_dry_yagni/bad_string_utils.py && python3 08_simplicity_kiss_dry_yagni/good_string_utils.py
```

## Contents map

- `examples/` — complete teaching repo: `QUICK_REFERENCE.md`, 8 module dirs, each with README + bad/good code
- `examples/QUICK_REFERENCE.md` — cheat sheet: principles, smells table, decision tree, Python tips
- `references/design-principles.md` — each principle in depth: definition, why, how, ask-yourself, bad→good
- `references/code-smells-and-fixes.md` — smells table, decision tree, review rubric
- `references/python-specifics.md` — Python tooling patterns with code snippets
- `references/verified-sources.md` — online verification: authoritative sources per principle (search date 2026-02-03)

## Note on fixes (skill copy only)

- `examples/05_portability/good_file_handler.py`: the original "Production"
  scenario wrote to `/var/app/data`, which crashes with `PermissionError` when
  the demo is run. In the skill copy, the demo uses a writable temp dir
  (`$TMPDIR/ppc-demo`) and cleans it up, so the portability demo runs anywhere.
  The teaching point (env-driven configuration) is unchanged.

## Quotes worth keeping

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

> "Make it work, make it right, make it fast." — Kent Beck
