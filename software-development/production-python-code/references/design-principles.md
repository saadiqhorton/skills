# Design Principles — Deep Dive

Detail behind the eight principles in `SKILL.md`. Each section: definition, why
it matters, how to apply, ask-yourself question, and the bad→good demo location.

---

## 1. Cohesion & Single Responsibility Principle (SRP)

**Definition.** A class should have one, and only one, reason to change.
Cohesion is how closely related and focused the responsibilities of a module are.

**Why it matters.** A class with many reasons to change breaks every time any of
them changes; it is hard to test, modify, or reuse individual pieces.

**How to apply.**
- Give each responsibility its own class: validators validate, repositories
  persist, services send email, loggers log, orchestrators orchestrate.
- A thin `Service`/facade may compose specialized classes — delegation is fine,
  dumping everything into one class is not.
- Describe the class in one sentence; if you need "and", split it.

**Ask yourself.** "Can I describe this class's purpose in one sentence without
using 'and'?"

**Demo:** [bad_user_manager.py](examples/01_cohesion_srp/bad_user_manager.py) (a `UserManager` that
validates, persists, emails, and reports) vs `good_user_manager.py` (separate
`EmailValidator`, `PasswordValidator`, `UserRepository`, `EmailService`,
`UserActivityLogger`, orchestrated by `UserService`).

---

## 2. Encapsulation & Abstraction

**Definition.** Encapsulation hides internal implementation details and exposes
only what is necessary. Abstraction provides a simple interface that hides
complexity.

**Why it matters.** Without it, clients can corrupt internal state, bypass
business rules, and break when the internal representation changes.

**How to apply.**
- Private-by-convention state: `_name` / `_balance` (single underscore). Do not
  expose raw internals as public attributes.
- Expose behavior, not data: `deposit()`, `withdraw()`, `get_balance()` instead
  of poking at fields.
- Validate and enforce business rules inside the class.
- Return copies of internal collections, never the live list.
- Keep private helpers (`_add_transaction`) for implementation details.

**Ask yourself.** "If I change this internal implementation, will client code break?"

**Demo:** [bad_bank_account.py](examples/02_encapsulation_abstraction/bad_bank_account.py) (balance set
to -500, instant-millionaire, corrupted `transactions`) vs `good_bank_account.py`
(validated `deposit`/`withdraw`, read-only `get_balance`, statement returns a copy,
automatic audit trail via `Transaction`).

---

## 3. Loose Coupling & Modularity

**Definition.** Coupling is the degree of interdependence between modules.
Modularity divides a system into separate, interchangeable components. Loose
coupling means components depend on abstractions, not concrete implementations.

**Why it matters.** Tight coupling makes components untestable in isolation and
forces ripple edits when a dependency changes or a new variant is added.

**How to apply.**
- Depend on an interface: `abc.ABC` with `@abstractmethod` (or `typing.Protocol`).
- Inject dependencies through the constructor; never instantiate collaborators
  inside the class that uses them.
- Keep modules small with clear boundaries; each module reusable on its own.
- Compose behavior (e.g., a `MultiNotifier` of notifiers) instead of embedding
  dispatch logic in consumers.

**Ask yourself.** "Can I test this component without instantiating half my system?"

**Demo:** [bad_notification.py](examples/03_loose_coupling_modularity/bad_notification.py)
(`OrderProcessor` hard-codes `EmailSender`) vs `good_notification/` (a `Notifier`
ABC, `EmailNotifier`, `SMSNotifier`, `MultiNotifier`, and an `OrderProcessor`
that takes any `Notifier` — swap email for SMS with zero processor changes).

---

## 4. Reusability & Extensibility (Open/Closed)

**Definition.** Reusability: code usable in multiple contexts without
modification. Extensibility: new functionality added without modifying existing
code — open for extension, closed for modification (OCP).

**Why it matters.** If/else dispatch chains grow, couple all variants to one
class, and force edits to working code for every new feature.

**How to apply.**
- Prefer composition and Strategy/plugin style: define a formatter/handler
  interface, then add variants as new classes implementing it.
- A generator works with any implementation and can swap at runtime.
- Reuse individual components directly in other contexts (a `CSVFormatter`
  outside the report generator).
- Balance with KISS/YAGNI (#8): introducing an interface is worth it when
  variants are real and multiple; a one-off function does not need a plugin
  architecture.

**Ask yourself.** "Can I add new functionality without editing existing code?"

**Demo:** [bad_report.py](examples/04_reusability_extensibility/bad_report.py) (a `generate_report`
method with text/CSV/HTML branches, each new format edits the method) vs
`good_report.py` (`ReportFormatter` ABC with `TextFormatter`, `CSVFormatter`,
`HTMLFormatter`, plus added-later `JSONFormatter` and `MarkdownFormatter` — new
formats ship as new classes, existing code untouched).

---

## 5. Portability

**Definition.** Code should work across platforms, environments, and
configurations without modification.

**Why it matters.** Hard-coded Windows paths, `\\` concatenation, baked-in
usernames, and fixed endpoints mean code breaks on other OSes and cannot run in
dev/staging/prod or in tests with different configs.

**How to apply.**
- Use `pathlib.Path` for all path work (`/` joins paths on every OS).
- Configuration via environment variables (`os.getenv`) with safe defaults,
  or config files — never hard-code paths, hosts, ports, or URLs.
- Abstract environment details behind a `Config` object; inject it.
- Ensure directories exist (`mkdir(parents=True, exist_ok=True)`).

**Ask yourself.** "Will this work on Linux, Windows, and Mac?"

**Demo:** [bad_file_handler.py](examples/05_portability/bad_file_handler.py) (hard-coded
`C:\\Users\\John\\Documents`, `\\` separators, localhost DB/API) vs
`good_file_handler.py` (`Config` from env vars with defaults, `pathlib` paths,
env-swappable prod config) plus `config_example.env`.

---

## 6. Defensibility

**Definition.** Write code that fails safely and catches errors early: fail fast,
fail safe, fail loud.

**Why it matters.** Silent failures hide bugs until production; unvalidated input
corrupts state; unsafe defaults (debug on, no timeout, unbounded retries) leak
data or hang; storing secrets (CVV, full card numbers) breaks PCI compliance.

**How to apply.**
- **Fail-fast:** validate all inputs at the boundary, immediately, with specific
  exceptions (`ValidationError` with a clear message) — never accept bad input.
- **Safe defaults:** `debug_mode=False` (not `True`), bounded `max_retry=3` (not
  100), explicit `timeout=30` (not `None`).
- **Least privilege:** log/store only what's necessary; mask card data
  (`****-****-****-1234`); never store or log CVV.
- **Fail loud:** raise custom exceptions (`PaymentError`) and chain the cause
  (`raise ... from e`); don't `except: return None`.
- Immutable results (`@dataclass(frozen=True)`) prevent tampering.
- Use `decimal.Decimal` for money — never floats.

**Ask yourself.** "What's the worst that could happen with bad input?"

**Demo:** [bad_payment.py](examples/06_defensibility/bad_payment.py) (accepts negative amounts,
strings, missing CVV; logs CVV; debug on by default; returns `None` on error)
vs `good_payment.py` (full fail-fast validation, safe defaults, masked account,
immutable `PaymentResult`, exceptions chained and propagated).

---

## 7. Maintainability & Testability

**Definition.** Maintainability: code is easy to understand, modify, and debug.
Testability: code is easy to test in isolation.

**Why it matters.** Logic tangled with I/O (logging, file writes, timestamps,
network) cannot be unit-tested without mocks; duplicated nested parsing is
fragile and hard to extend.

**How to apply.**
- Pure functions for computation: same input → same output, no side effects.
- Separate business logic from I/O: parser, operations, and calculator are
  distinct classes; side-effect versions (`CalculatorWithHistory`) wrap the pure
  core.
- Dependency injection for anything external (clock, files, network) so tests
  can substitute fakes.
- Clear data structures (`@dataclass CalculationResult`) instead of tuples of
  mystery values.
- Ship tests covering happy path, edge cases (negative, zero, whitespace), and
  error cases; assert exceptions via `assertRaises`.

**Ask yourself.** "Can I write a unit test for this without mocking 5 things?"

**Demo:** [bad_calculator.py](examples/07_maintainability_testability/bad_calculator.py) (file I/O
mixed into calculation, duplicated parse branches, `except:` swallowing) vs
`good_calculator/` (`OperationParser`, pure `Operations`, thin `Calculator`,
`CalculatorWithHistory`) with `test_calculator.py` (24 assertions across 4 test
classes — run it with `python3 good_calculator/test_calculator.py`).

---

## 8. Simplicity — KISS, DRY, YAGNI

**Definition.**
- **KISS** — Keep It Simple: prefer simple solutions over clever ones; avoid
  unnecessary abstractions; if it's hard to explain, it's too complex.
- **DRY** — Don't Repeat Yourself: extract common logic into one function;
  single source of truth; repetition is a maintenance burden.
- **YAGNI** — You Aren't Gonna Need It: don't build for hypothetical futures;
  add features when actually needed.

**Why it matters.** Over-engineering multiplies code to write, test, debug, and
maintain; duplication means every fix must be applied N times; speculative
features rot.

**How to apply.**
- Use Python's built-ins: `text[::-1]` beats a manual reversal loop; `str.upper()`
  beats a transformer class hierarchy.
- One parameterized function beats three copy-pasted methods
  (`greet_user(name, time_of_day)` instead of morning/afternoon/evening copies).
- Delete speculative placeholders; implement features when a real need exists.

**Ask yourself.**
- "Am I making this more complex than it needs to be?"
- "Have I written this exact logic elsewhere?"
- "Will I really need this feature?"

**Demo:** [bad_string_utils.py](examples/08_simplicity_kiss_dry_yagni/bad_string_utils.py) (enum +
ABC + three transformer classes + factory + three duplicated greeting methods +
unused future features + manual reversal loop) vs `good_string_utils.py` (four
short functions, one parameterized greeting, `[::-1]` slicing, no dead code).

---

## Tension between principles

Principles 1–4 push toward more structure (more classes, interfaces, patterns);
principle 8 pulls back toward less. The production-correct answer is context-
dependent: introduce abstraction when variants are real and code is exercised,
not "just in case". See `references/verified-sources.md` for the OCP/YAGNI
tradeoff, and `references/code-smells-and-fixes.md` for the decision tree that
keeps the balance.
