# Code Smells → Fixes, Decision Tree, Review Rubric

Part of the `production-python-code` skill. Use while writing, reviewing, or
refactoring to map symptoms to principles and concrete fixes.

## Smells table

Each smell links its **bad** example (`bad_*.py`) and the **good** fix
(`good_*.py` or `good_*/`). Run both, then diff them.

| Code smell | Principle violated | Bad example | Good example | Fix |
|---|---|---|---|---|
| God class doing everything | SRP/cohesion | [bad_user_manager.py](examples/01_cohesion_srp/bad_user_manager.py) | [good_user_manager.py](examples/01_cohesion_srp/good_user_manager.py) | Split into focused classes; orchestrate with a thin service |
| Public fields everywhere | Encapsulation | [bad_bank_account.py](examples/02_encapsulation_abstraction/bad_bank_account.py) | [good_bank_account.py](examples/02_encapsulation_abstraction/good_bank_account.py) | Private `_attrs` + behavior methods + validation inside class |
| Hard-coded dependencies (`self.email = EmailSender()`) | Loose coupling | [bad_notification.py](examples/03_loose_coupling_modularity/bad_notification.py) | [good_notification/](examples/03_loose_coupling_modularity/good_notification/) | Constructor injection behind an ABC/Protocol |
| Giant if/else for types / formats | Extensibility | [bad_report.py](examples/04_reusability_extensibility/bad_report.py) | [good_report.py](examples/04_reusability_extensibility/good_report.py) | Strategy objects behind one interface; register new variants as classes |
| Hard-coded paths, `\` joins, machine names, localhost | Portability | [bad_file_handler.py](examples/05_portability/bad_file_handler.py) | [good_file_handler.py](examples/05_portability/good_file_handler.py) | `pathlib.Path`, env vars with defaults, `Config` injection |
| Silent failures (`except: return None`), no validation, unsafe defaults | Defensibility | [bad_payment.py](examples/06_defensibility/bad_payment.py) | [good_payment.py](examples/06_defensibility/good_payment.py) | Fail-fast validation, specific exceptions, safe defaults, least privilege |
| 500-line function / logic tangled with file I/O / untested | Maintainability/testability | [bad_calculator.py](examples/07_maintainability_testability/bad_calculator.py) | [good_calculator/](examples/07_maintainability_testability/good_calculator/) | Pure functions separated from I/O; component classes; tests |
| Copy-pasted code, unused "future" code, over-abstraction | KISS/DRY/YAGNI | [bad_string_utils.py](examples/08_simplicity_kiss_dry_yagni/bad_string_utils.py) | [good_string_utils.py](examples/08_simplicity_kiss_dry_yagni/good_string_utils.py) | Extract once, parameterize, delete speculative features, use built-ins |

## Quick decision tree

```
Is my class doing more than one thing?
├─ Yes → Split it (SRP)
└─ No → OK

Can clients modify my internal state?
├─ Yes → Make it private (Encapsulation)
└─ No → OK

Am I creating dependencies inside my class?
├─ Yes → Inject them (Loose Coupling)
└─ No → OK

Do I need to edit existing code to add features?
├─ Yes → Use strategy/plugin pattern (Extensibility)
└─ No → OK

Do I have hard-coded paths or platform assumptions?
├─ Yes → Use pathlib and config (Portability)
└─ No → OK

Am I accepting input without validation?
├─ Yes → Validate and fail-fast (Defensibility)
└─ No → OK

Would this be hard to test?
├─ Yes → Separate logic from I/O (Testability)
└─ No → OK

Am I adding abstractions "just in case"?
├─ Yes → Remove it (YAGNI/KISS)
└─ No → OK

Am I repeating this logic?
├─ Yes → Extract it (DRY)
└─ No → OK
```

## Review rubric

Score each dimension PASS / FAIL / PARTIAL, with one line of evidence and one
line for the fix. Report the verdict table to the caller.

| Dimension | PASS/FAIL | Evidence | Fix |
|---|---|---|---|
| SRP/cohesion (one responsibility per class) | | | |
| Encapsulation/abstraction (no leaked internals) | | | |
| Coupling (abstractions injected, no internal `new`) | | | |
| Extensibility (new variants need no edits) | | | |
| Portability (pathlib + env config) | | | |
| Defensibility (validate, fail fast, safe defaults) | | | |
| Testability (pure logic, tests exist and pass) | | | |
| Simplicity (KISS/DRY/YAGNI respected) | | | |

Cutoff for "production-ready" per review: every dimension PASS or PASS with a
documented, scheduled fix. Any FAIL on encapsulation, defensibility, or
testability is a blocker, not a nit.

## Self-check when you finish a change

- [ ] Each new class has exactly one job (say it in one sentence without "and").
- [ ] No public attributes that can be corrupted; behavior goes through methods.
- [ ] Every collaborator is injected; consumers know only interfaces.
- [ ] A new format/variant requires a new class, not an edit to existing code.
- [ ] No absolute paths, `\\`, machine names, or hard-coded endpoints; env config used.
- [ ] Every public entry point validates input and raises specific exceptions; no silent `None`.
- [ ] Computation is pure; I/O is isolated; tests cover happy + edge + error paths and pass.
- [ ] Nothing duplicated, nothing speculative, no abstractions with a single use.
