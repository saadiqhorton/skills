# Online Verification of Best Practices

The principles in this skill were verified against authoritative, current
sources via web search on **2026-02-03** (Tavily CLI). Each principle below
lists the sources that confirm it and what they confirm. Where the community
debates a principle, the debate is noted so the skill stays accurate rather
than dogmatic.

## 1. SRP & cohesion

- **Real Python — "SOLID Design Principles: Improve Object-Oriented Code in Python"**
  https://realpython.com/solid-principles-python
  Confirms SRP: a class should have one and only one reason to change, and that
  SRP increases cohesion and decreases coupling.
- **Stackify — "SOLID Design Principles: The Single Responsibility Explained"**
  https://stackify.com/solid-design-principles
  Confirms SRP means a class is not allowed to have more than one responsibility
  (e.g., entity management vs. data-type conversion), avoiding unnecessary coupling.
- **DEV Community — "A Pythonic Guide to SOLID Design Principles"**
  https://dev.to/ezzy1337/a-pythonic-guide-to-solid-design-principles-4c8i
  Confirms SRP "increases cohesion and decreases coupling by organizing code
  around responsibilities."

## 2. Encapsulation & abstraction

- **GeeksforGeeks — "Encapsulation in Python"**
  https://www.geeksforgeeks.org/python/encapsulation-in-python
  Confirms private attributes accessed through getters/setters provide
  controlled access and safe modification.
- **roadmap.sh — "Encapsulation in Python"**
  https://roadmap.sh/python/encapsulation
  Confirms: design a clear, focused public interface; avoid exposing attributes
  or methods that serve only internal tasks.
- **Python Programming MOOC 2025 — "Encapsulation"**
  https://programming-25.mooc.fi/part-9/3-encapsulation
  Confirms classes hide attributes from clients; hidden attributes are accessed
  via methods.

## 3. Loose coupling & dependency injection

- **ArjanCodes — "Best Practices for Python Dependency Injection"**
  https://arjancodes.com/blog/python-dependency-injection-best-practices
  Confirms DI is especially valuable in testing: replace real dependencies with
  mocks/stubs, which requires injection rather than internal instantiation.
- **OneUptime — "How to Implement Dependency Injection in Python"**
  https://oneuptime.com/blog/post/2026-02-03-python-dependency-injection/view
  Confirms the practice: depend on abstractions (protocols or ABCs) instead of
  concrete classes; inject at the boundary; keep constructors simple.

## 4. Open/Closed & strategy pattern

- **LogRocket — "SOLID series: The Open-Closed Principle"**
  https://blog.logrocket.com/solid-open-closed-principle
  Confirms OCP: extend code without modifying it, and that SRP should be applied
  alongside OCP.
- **Microsoft Learn — "Patterns in Practice: The Open Closed Principle"**
  https://learn.microsoft.com/en-us/archive/msdn-magazine/2008/june/patterns-in-practice-the-open-closed-principle
  Confirms dividing business logic/data access into separate classes lets either
  side change independently.
- **Reality check (debate, important for balance):** OCP is widely critiqued as
  expensive when applied speculatively — see "Open-closed principle considered
  harmful?" (r/ExperiencedDevs, https://www.reddit.com/r/ExperiencedDevs/comments/vbi9im/openclosed_principle_considered_harmful)
  and "Clarify the Open/Closed Principle" (Software Engineering Stack Exchange,
  https://softwareengineering.stackexchange.com/questions/19627/clarify-the-open-closed-principle).
  This is exactly why this skill pairs extensibility (#4) with KISS/YAGNI (#8):
  introduce extension points for *real* variation, not hypothetical futures.

## 5. Portability & pathlib

- **Python docs — `pathlib` — Object-oriented filesystem paths**
  https://docs.python.org/3/library/pathlib.html
  Official documentation; pathlib is the object-oriented, cross-platform path API.
- **Real Python — "Python's pathlib Module: Taming the File System"**
  https://realpython.com/python-pathlib
  Confirms pathlib's motivation: representing the file system with dedicated
  objects instead of strings.
- **Trey Hunner — "Why you should be using pathlib"**
  https://treyhunner.com/2018/12/why-you-should-be-using-pathlib
  Confirms pathlib works across platforms and integrates with the OS-appropriate
  separators automatically.

## 6. Defensibility (fail-fast, least privilege, safe defaults)

- **OWASP Developer Guide — "Principles of security"**
  https://devguide.owasp.org/en/02-foundations/03-security-principles
  Confirms fail-safe default: "unless an entity is given explicit access to an
  object, it should be denied access by default."
- **OWASP — "Least Privilege Principle"**
  https://owasp.org/www-community/controls/Least_Privilege_Principle
  Confirms least privilege: a user, process, or program should be given only the
  minimum privileges necessary.
- **Pragmatic Programmer (via "Building Real Software: Defensive Programming")**
  http://swreflections.blogspot.com/2012/03/defensive-programming-being-just-enough.html
  Confirms defensive programming as "Pragmatic Paranoia": protect your code from
  others' mistakes and your own; "if in doubt, validate."
- **Pluralsight — "Defensive Programming in Python"**
  https://www.pluralsight.com/resources/blog/guides/defensive-programming-in-python
  Confirms Python-specific guidance: use asserts sparingly, validate input
  explicitly rather than via exception-swallowing.

## 7. Testability & pure functions

- **Bryce Fisher-Fleig — "Separate IO from Logic"**
  http://bryce.fisher-fleig.org/separate-io-from-logic
  Confirms separating core logic from IO greatly enhances readability and
  testability.
- **Coding with Sam — "Interfaces vs Pure Functions"**
  https://codingwithsam.com/2019/02/22/interfaces-vs-pure-functions
  Confirms pure functions give confidence that business logic executes correctly
  and are easy to test.

## 8. KISS / DRY / YAGNI

- **Wikipedia — "You aren't gonna need it"**
  https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it
  Confirms YAGNI: don't add functionality until it is needed; avoids feature
  creep.
- **Boldare — "DRY, KISS & YAGNI Principles: Guide & Benefits"**
  https://www.boldare.com/blog/kiss-yagni-dry-principles
  Confirms definitions: KISS = simplest solution that works; YAGNI and DRY as
  core development principles.

## Method note

Searches were run with the Tavily CLI (`tvly search --max-results 5 --json`)
on 2026-02-03 for: SOLID/SRP, Python production practices (pathlib, type hints,
dataclasses, ABC, context managers), defensive programming/fail-fast,
KISS/DRY/YAGNI, Python encapsulation, dependency injection in Python, strategy
pattern / OCP, and OWASP least-privilege. URLs above were returned by those
searches; verify live links if a long time has passed, since URLs and content
may move.
