# minival
![npm](https://img.shields.io/npm/v/minival)
![license](https://img.shields.io/npm/l/minival)
![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

> Minimal, fast, and function-based validation library for JavaScript & TypeScript.\
> Ideal for small apps, edge runtimes, and constrained environments like AWS AppSync.

- 🪶 **Tiny and fast** — 595 bytes Brotli, 674 bytes gzip, 2.3 KB raw (all features)
- 🌲 **Tree-shaking** — Only include what you use, zero dependencies
- 🧠 **Function-first** — Compose rules with plain functions, no decorators or classes
- 🔁 **Composable** — Build custom rules with `and()`, `or()`, `opt()`, `req()`
- 🧾 **Typed schemas** — Full TypeScript support with optional generics
- 🔍 **Essential validators** — Strings, numbers, booleans, regex, min/max, email, equals, not-equals
- 💬 **Clear error reporting** — Per-field messages, easy to use with UI libraries
- 🔌 **React Hook Form compatible** — Drop-in `resolver` integration with RHF
- 🚀 **AppSync-ready** — JS-based, tiny enough for AWS AppSync JS resolvers
- 🧪 **100% test coverage** — Verified with Vitest

---

## 📦 Installation

```bash
npm install minival
```

---

## ⚡️ Quick Example

```ts
import { v, req, str, min } from 'minival';

const validate = v({
  username: req(str(), min(3))
});

const { valid, data, errors } = validate({ username: 'Al' });

if (!valid) {
  console.error(errors); // ❌ "username must be at least 3 characters"
} else {
  console.log(data.username);
}
```

---

## ✨ API Reference Table

### 🔹 Validator

| Function | Description              | Signature                                            |
|----------|--------------------------|-------------------------------------------------------|
| `v()`    | Builds a validator       | `<T>(schema: S) => (data: T) => Result<T>`           |

### 🔹 Rule Groups

| Function   | Description              | Signature               |
|------------|--------------------------|--------------------------|
| `req()`    | Required field           | `(...rules: R[]) => R[]` |
| `opt()`    | Optional field           | `(...rules: R[]) => R[]` |

### 🔹 Validators

| Function   | Description              | Signature                    |
|------------|--------------------------|-------------------------------|
| `str()`    | Must be a string         | `() => R`                     |
| `num()`    | Must be a number         | `() => R`                     |
| `bool()`   | Must be a boolean        | `() => R`                     |
| `min(n)`   | Min length or value      | `(n: number) => R`            |
| `max(n)`   | Max length or value      | `(n: number) => R`            |
| `email()`  | Must be valid email      | `() => R`                     |
| `rgx(r)`   | Match regex              | `(regex: RegExp) => R`        |
| `eq(v)`    | Must equal value         | `(value: any) => R`           |
| `ne(v)`    | Must not equal value     | `(value: any) => R`           |

### 🔹 Operators

| Function   | Description              | Signature               |
|------------|--------------------------|--------------------------|
| `and(...)` | All rules must pass      | `(...rules: R[]) => R`   |
| `or(...)`  | At least one must pass   | `(...rules: R[]) => R`   |

> `R = (value: any, field: string) => string | undefined`

Missing any feature? Request it by [creating an issue](https://github.com/paupenin/minival/issues).

---

## 🛠 Usage

```ts
import { v, req, opt, str, num, min, max, email, rgx, and, or, eq } from 'minival';

const schema = v({
  email: req(str(), email(), min(6), max(128)),
  password: req(
    str(),
    min(8),
    max(128),
    rgx(/[a-z]/),  // contains lowercase
    rgx(/[A-Z]/),  // contains uppercase
    rgx(/[0-9]/)   // contains number
  ),
  age: opt(num(), min(18)),
  role: req(or(eq("admin"), eq("user")))
});

const input = {
  email: "user@example.com",
  password: "Password123",
  age: 30,
  role: "admin"
};

const { valid, errors, data } = schema(input);

if (!valid) {
  console.error(errors);
} else {
  console.log("Validated data:", data);
}
```

---

## 🧠 TypeScript Support

You can optionally pass a generic to `v<>()` to fully type the validated `data` object:

```ts
const schema = v<{
  name: string;
  nickname?: string;
}>({
  name: req(str()),
  nickname: opt(str()),
});

const { valid, data } = schema({ name: "John" });

if (valid) {
  // data is strongly typed
  console.log(data.name.toUpperCase()); // ✅ OK
  console.log(data.nickname?.toLowerCase()); // ✅ Optional chaining works
}
```

---

## 📚 Examples for Each Function

```ts
// req(): Field is required
v({ name: req() })({}); // ❌ "name is required"

// opt(): Optional field
v({ nickname: opt(str()) })({}); // ✅ Passes

// str(): Must be a string
v({ name: req(str()) })({ name: 123 }); // ❌ "name must be a string"

// num(): Must be a number
v({ age: req(num()) })({ age: "30" }); // ❌ "age must be a number"

// bool(): Must be a boolean
v({ active: req(bool()) })({ active: "true" }); // ❌ "active must be a boolean"

// min(): Minimum length or value
v({ age: req(min(18)) })({ age: 17 }); // ❌ "age must be at least 18"

// max(): Maximum length or value
v({ name: req(max(3)) })({ name: "John" }); // ❌ "name must be at most 3 characters"

// rgx(): Regex rule
v({ code: req(rgx(/^\d{4}$/)) })({ code: "abc" }); // ❌ "code is invalid"

// email(): Must be a valid email
v({ email: req(email()) })({ email: "invalid" }); // ❌ "email must be a valid email"

// eq(): Must equal
v({ role: req(eq("admin")) })({ role: "user" }); // ❌ "role must be admin"

// ne(): Must not equal
v({ banned: req(ne(true)) })({ banned: true }); // ❌ "banned must not be true"

// and(): All rules must pass
v({ username: req(and(str(), min(4), max(10))) })({ username: "ab" }); // ❌ too short

// or(): Any rule can pass
v({ promo: req(or(eq("A"), eq("B"))) })({ promo: "C" }); // ❌ "promo is invalid"
```

---

## 🧩 Custom Rule Example

Create your custom validation rules:

```ts
import { v, req } from 'minival';

// Define a custom rule function
const isEven = () => (val, field) => {
  if (typeof val !== 'number' || val % 2 !== 0) {
    return `${field} must be an even number`;
  }
};

const schema = v({
  luckyNumber: req(isEven())
});

schema({ luckyNumber: 3 }); // ❌ "luckyNumber must be an even number"
schema({ luckyNumber: 8 }); // ✅ Passes
```

---

## 🧩 With React Hook Form

Integration example:

```tsx
import { useForm } from "react-hook-form";
import { v, req, str, min, email } from "minival";

const schema = v({
  email: req(str(), email(), min(6))
});

export function MyForm() {
  const form = useForm({
    resolver: (values) => {
      const { valid, data, errors } = schema(values);

      return valid
        ? { values: data, errors: {} }
        : {
            values: {},
            errors: Object.fromEntries(
              errors.map(e => [e.field, { type: "validate", message: e.message }])
            ),
          };
    },
  });

  return <form />;
}
```

---

## 🙋‍♀️ Request Features or Report Bugs

If you'd like to request a new validation rule or report a bug, please open an issue on the [GitHub repository](https://github.com/paupenin/minival/issues).

- Describe the use case clearly
- Provide example input and expected output
- Contributions and suggestions are always welcome!

---

## 📖 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release notes.

---

## 🧪 Test Coverage

> **100% test coverage** powered by [Vitest](https://vitest.dev)

---

## 📝 License

MIT © 2025-present — Pau Penin
