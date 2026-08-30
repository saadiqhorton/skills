# Python-Specific Best Practices

Part of the `production-python-code` skill. Idioms that make the eight design
principles concrete in Python. Runnable examples live in `examples/`; each
snippet below matches a pattern from the good examples.

## Paths: `pathlib.Path`, not string surgery

```python
from pathlib import Path

# OK: object-oriented, cross-platform (works on Windows, Linux, macOS)
path = Path("data") / "subfolder" / "file.txt"      # data/subfolder/file.txt on every OS
out = Path(filename).stem + ".csv"                   # platform-independent rename
path.parent.mkdir(parents=True, exist_ok=True)

# Not: string concatenation or hard-coded separators
# path = "data" + "/" + "subfolder" + "/" + "file.txt"  # breaks on Windows
```

See [good_file_handler.py](examples/05_portability/good_file_handler.py).

## Type hints (PEP 484)

```python
from typing import Dict, List, Optional

def process(data: List[str]) -> Dict[str, int]:   # clear interface
    ...

# Not: def process(data): ...   mystery input/output
```

Hints make the interface self-documenting and give type checkers (mypy, pyright)
something to verify. See [good_user_manager.py](examples/01_cohesion_srp/good_user_manager.py).

## Data containers: `@dataclass`

```python
from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    email: str
    age: int

@dataclass(frozen=True)          # immutable result → tamper-proof
class PaymentResult:
    transaction_id: str
    amount: Decimal
    masked_account: str
    status: str
```

`frozen=True` gives immutability that supports defensibility (#6). See
[good_payment.py](examples/06_defensibility/good_payment.py) and
[calculator.py](examples/07_maintainability_testability/good_calculator/calculator.py).

## Interfaces: `abc.ABC` / `typing.Protocol`

```python
from abc import ABC, abstractmethod

class Notifier(ABC):
    @abstractmethod
    def send(self, recipient: str, subject: str, message: str) -> None:
        """Send a notification."""
```

Consumers depend on `Notifier`, not on `EmailNotifier`/`SMSNotifier` — that is
what makes injection and swapping work (#3, #4). See
[notifier.py](examples/03_loose_coupling_modularity/good_notification/notifier.py).

## Resources: context managers

```python
# OK: automatic cleanup even on error
with open("file.txt") as f:
    data = f.read()

# Not: manual open/close — close() can be skipped on exception
# f = open("file.txt"); data = f.read(); f.close()
```

Same idea for locks, DB sessions, connections. See the calculator's history
pattern for keeping I/O at the edges.

## Configuration: environment variables + safe defaults

```python
import os
from pathlib import Path

input_dir = Path(os.getenv("INPUT_DIR", "./data"))     # safe default
db_host   = os.getenv("DB_HOST", "localhost")
db_port   = int(os.getenv("DB_PORT", "5432"))          # explicit, validated
api_url   = os.getenv("API_URL", "http://localhost:8000/api")
```

No hard-coding of paths, hosts, or endpoints — env config makes the same code
run in dev, staging, and prod. See [good_file_handler.py](examples/05_portability/good_file_handler.py)
and [config_example.env](examples/05_portability/config_example.env).

## Money: `decimal.Decimal`, never float

```python
from decimal import Decimal

amount = Decimal(str(raw_amount))   # exact; validate > 0 and <= limit
```

Floats accumulate rounding errors; payment code must be exact. See
[good_payment.py](examples/06_defensibility/good_payment.py).

## Design: pure functions, I/O at the edges

```python
def add(a, b):          # pure: same input → same output, no side effects
    return a + b

def add_and_log(a, b):  # impure: side effects make testing harder
    result = a + b
    print(f"Result: {result}")   # side effect
    return result
```

Pure computation is trivially unit-testable; logging, file writes, network, and
time should be injected or wrapped at the boundary. See
[good_calculator](examples/07_maintainability_testability/good_calculator/) — `Operations` is
pure; `CalculatorWithHistory` adds side effects around the pure core.

## Testing: unittest or pytest on the pure core

```python
import unittest

class TestOperations(unittest.TestCase):
    def test_add(self):
        self.assertEqual(Operations.add(5, 3), 8)

    def test_divide_by_zero(self):
        with self.assertRaises(ValueError):
            Operations.divide(10, 0)
```

Cover happy paths, edge cases (negative, zero, whitespace), and error cases.
Run with `python3 good_calculator/test_calculator.py`.

## Fail-fast idioms

```python
class ValidationError(Exception):
    pass

def validate_amount(amount) -> Decimal:
    try:
        value = Decimal(str(amount))
    except Exception as exc:
        raise ValidationError(f"Invalid amount: {amount}") from exc
    if value <= 0:
        raise ValidationError(f"Amount must be positive, got {value}")
    return value
```

Validate at the boundary, raise specific exceptions with messages, chain causes
(`raise ... from exc`), never `except: pass` or `except Exception: return None`.

## Least privilege by default

```python
class PaymentProcessor:
    def __init__(self, debug_mode: bool = False,   # safe: OFF
                 max_retry: int = 3,                # bounded
                 timeout: int = 30):                # explicit, not None
        ...

def _mask_account(account: str) -> str:
    return f"****-****-****-{account[-4:]}"         # never log full numbers/CVV
```

See [good_payment.py](examples/06_defensibility/good_payment.py).

## Simplicity idioms

```python
text[::-1]                       # reverse — not a manual loop
greet_user(name, time_of_day)    # one parameterized fn — not 3 copies
```

The good string utils are ~70 lines of functions; the bad version needed
~100+ lines of enums, ABCs, factories, and dead placeholders for the same
behavior. See [good_string_utils.py](examples/08_simplicity_kiss_dry_yagni/good_string_utils.py).
