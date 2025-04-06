import { describe, expect, it } from "vitest";
import {
  and,
  bool,
  email,
  eq,
  max,
  min,
  ne,
  num,
  opt,
  or,
  req,
  rgx,
  str,
  v,
} from ".";

describe("minival", () => {
  // All tests are running function `v`, so we don't need to test it.

  describe("req", () => {
    it("validates required fields", () => {
      const schema = v({ name: req() });
      expect(schema({ name: "" })).toEqual({
        valid: false,
        errors: [{ field: "name", message: "name is required" }],
        data: undefined,
      });
      expect(schema({})).toEqual({
        valid: false,
        errors: [{ field: "name", message: "name is required" }],
        data: undefined,
      });
      expect(schema({ name: "John" })).toEqual({
        valid: true,
        data: { name: "John" },
        errors: undefined,
      });
    });
  });

  describe("opt", () => {
    it("validates optional fields", () => {
      const schema = v({ nickname: opt(str(), min(3)) });
      expect(schema({})).toEqual({ valid: true, data: {}, errors: undefined });
      expect(schema({ nickname: "Al" })).toEqual({
        valid: false,
        errors: [
          {
            field: "nickname",
            message: "nickname must be at least 3 characters",
          },
        ],
        data: undefined,
      });
    });
  });

  describe("str", () => {
    it("validates string", () => {
      const schema = v({ name: req(str()) });
      expect(schema({ name: "John" })).toEqual({
        valid: true,
        data: { name: "John" },
        errors: undefined,
      });
      expect(schema({ name: 123 })).toEqual({
        valid: false,
        errors: [{ field: "name", message: "name must be a string" }],
        data: undefined,
      });
    });
  });

  describe("num", () => {
    it("validates number", () => {
      const schema = v({ age: req(num()) });
      expect(schema({ age: 123 })).toEqual({
        valid: true,
        data: { age: 123 },
        errors: undefined,
      });
      expect(schema({ age: "123" })).toEqual({
        valid: false,
        errors: [{ field: "age", message: "age must be a number" }],
        data: undefined,
      });
    });
  });

  describe("bool", () => {
    it("validates boolean", () => {
      const schema = v({ active: req(bool()) });
      expect(schema({ active: true })).toEqual({
        valid: true,
        data: { active: true },
        errors: undefined,
      });
      expect(schema({ active: "true" })).toEqual({
        valid: false,
        errors: [{ field: "active", message: "active must be a boolean" }],
        data: undefined,
      });
    });
  });

  describe("min", () => {
    it("validates minimum length", () => {
      const schema = v({ name: req(min(3)) });
      expect(schema({ name: "Al" })).toEqual({
        valid: false,
        errors: [
          { field: "name", message: "name must be at least 3 characters" },
        ],
        data: undefined,
      });
      expect(schema({ name: "John" })).toEqual({
        valid: true,
        data: { name: "John" },
        errors: undefined,
      });
    });

    it("validates minimum value for numbers", () => {
      const schema = v({ age: req(min(18)) });
      expect(schema({ age: 17 })).toEqual({
        valid: false,
        errors: [{ field: "age", message: "age must be at least 18" }],
        data: undefined,
      });
      expect(schema({ age: 18 })).toEqual({
        valid: true,
        data: { age: 18 },
        errors: undefined,
      });
    });
  });

  describe("max", () => {
    it("validates maximum length", () => {
      const schema = v({ name: req(max(3)) });
      expect(schema({ name: "Al" })).toEqual({
        valid: true,
        data: { name: "Al" },
        errors: undefined,
      });
      expect(schema({ name: "John" })).toEqual({
        valid: false,
        errors: [
          { field: "name", message: "name must be at most 3 characters" },
        ],
        data: undefined,
      });
    });

    it("validates maximum value for numbers", () => {
      const schema = v({ age: req(max(18)) });
      expect(schema({ age: 19 })).toEqual({
        valid: false,
        errors: [{ field: "age", message: "age must be at most 18" }],
        data: undefined,
      });
      expect(schema({ age: 18 })).toEqual({
        valid: true,
        data: { age: 18 },
        errors: undefined,
      });
    });
  });

  describe("eq", () => {
    it("validates equality", () => {
      const schema = v({ role: req(eq("admin")) });
      expect(schema({ role: "user" })).toEqual({
        valid: false,
        errors: [{ field: "role", message: "role is invalid" }],
        data: undefined,
      });
      expect(schema({ role: "admin" })).toEqual({
        valid: true,
        data: { role: "admin" },
        errors: undefined,
      });
    });
  });

  describe("ne", () => {
    it("validates inequality", () => {
      const schema = v({ banned: req(ne(true)) });
      expect(schema({ banned: true })).toEqual({
        valid: false,
        errors: [{ field: "banned", message: "banned is invalid" }],
        data: undefined,
      });
      expect(schema({ banned: false })).toEqual({
        valid: true,
        data: { banned: false },
        errors: undefined,
      });
    });
  });

  describe("rgx", () => {
    it("validates regex", () => {
      const schema = v({ code: req(rgx(/^\d{4}$/)) });
      expect(schema({ code: "abc" })).toEqual({
        valid: false,
        errors: [{ field: "code", message: "code is invalid" }],
        data: undefined,
      });
      expect(schema({ code: "1234" })).toEqual({
        valid: true,
        data: { code: "1234" },
        errors: undefined,
      });
    });
  });

  describe("email", () => {
    it("validates email format", () => {
      const schema = v({ email: req(email()) });
      expect(schema({ email: "invalid" })).toEqual({
        valid: false,
        errors: [{ field: "email", message: "email must be a valid email" }],
        data: undefined,
      });
      expect(schema({ email: "a@b.com" })).toEqual({
        valid: true,
        data: { email: "a@b.com" },
        errors: undefined,
      });
    });
  });

  describe("and", () => {
    it("validates and() logic", () => {
      const schema = v({ username: req(and(str(), min(4), max(10))) });
      expect(schema({ username: "a" })).toEqual({
        valid: false,
        errors: [
          {
            field: "username",
            message: "username must be at least 4 characters",
          },
        ],
        data: undefined,
      });
      expect(schema({ username: "toolongusername" })).toEqual({
        valid: false,
        errors: [
          {
            field: "username",
            message: "username must be at most 10 characters",
          },
        ],
        data: undefined,
      });
      expect(schema({ username: "validUser" })).toEqual({
        valid: true,
        data: { username: "validUser" },
        errors: undefined,
      });
    });
  });

  describe("or", () => {
    it("validates or() logic", () => {
      const schema = v({ promo: req(or(eq("A"), eq("B"))) });
      expect(schema({ promo: "C" })).toEqual({
        valid: false,
        errors: [{ field: "promo", message: "promo is invalid" }],
        data: undefined,
      });
      expect(schema({ promo: "A" })).toEqual({
        valid: true,
        data: { promo: "A" },
        errors: undefined,
      });
      expect(schema({ promo: "B" })).toEqual({
        valid: true,
        data: { promo: "B" },
        errors: undefined,
      });
    });
  });

  describe("complex rules", () => {
    it("validates complex rules", () => {
      const schema = v({
        user: req(str(), min(4), max(10), or(eq("admin"), eq("user"))),
        // password must be at least 8 characters, at most 16 characters, and contain at least one lowercase letter, one uppercase letter, and one number
        password: req(
          str(),
          min(8),
          max(16),
          rgx(/[a-z]/),
          rgx(/[A-Z]/),
          rgx(/\d/),
        ),
        remember: opt(bool()),
        age: req(num(), min(18), max(100)),
        promo: opt(str(), or(and(min(3), max(4)), and(min(6), max(7)))),
      });

      // Valid
      expect(
        schema({ user: "admin", password: "Password123", age: 25 }),
      ).toEqual({
        valid: true,
        data: { user: "admin", password: "Password123", age: 25 },
        errors: undefined,
      });

      // Password is required
      expect(schema({ user: "admin", remember: true, age: 101 })).toEqual({
        valid: false,
        errors: [
          {
            field: "password",
            message: "password is required",
          },
          { field: "age", message: "age must be at most 100" },
        ],
        data: undefined,
      });

      // Password does not contain uppercase letter
      expect(
        schema({
          user: "admin",
          password: "password123",
          remember: true,
          age: 17,
        }),
      ).toEqual({
        valid: false,
        errors: [
          {
            field: "password",
            message: "password is invalid",
          },
          { field: "age", message: "age must be at least 18" },
        ],
        data: undefined,
      });

      // Password does not contain number
      expect(
        schema({
          user: "admin",
          password: "Password",
          remember: true,
          age: 25,
        }),
      ).toEqual({
        valid: false,
        errors: [{ field: "password", message: "password is invalid" }],
        data: undefined,
      });

      // User is invalid
      expect(
        schema({ user: "john", password: "Password123", age: 25 }),
      ).toEqual({
        valid: false,
        errors: [{ field: "user", message: "user is invalid" }],
        data: undefined,
      });

      // Promo is valid
      expect(
        schema({
          user: "admin",
          password: "Password123",
          age: 25,
          promo: "ABCD",
        }),
      ).toEqual({
        valid: true,
        data: {
          age: 25,
          user: "admin",
          password: "Password123",
          promo: "ABCD",
        },
        errors: undefined,
      });

      // Promo is too short
      expect(
        schema({
          user: "admin",
          password: "Password123",
          age: 25,
          promo: "AB",
        }),
      ).toEqual({
        valid: false,
        errors: [
          { field: "promo", message: "promo must be at least 3 characters" },
        ],
        data: undefined,
      });

      // Promo is too long
      expect(
        schema({
          user: "admin",
          password: "Password123",
          age: 25,
          promo: "ABCDE",
        }),
      ).toEqual({
        valid: false,
        errors: [
          { field: "promo", message: "promo must be at most 4 characters" },
        ],
        data: undefined,
      });

      // Promo is valid on the second range
      expect(
        schema({
          user: "admin",
          password: "Password123",
          age: 25,
          promo: "ABCDEF",
        }),
      ).toEqual({
        valid: true,
        data: {
          age: 25,
          user: "admin",
          password: "Password123",
          promo: "ABCDEF",
        },
        errors: undefined,
      });

      // Promo is invalid on the second range
      expect(
        schema({
          user: "admin",
          password: "Password123",
          age: 25,
          promo: "ABCDEFGH",
        }),
      ).toEqual({
        valid: false,
        errors: [
          { field: "promo", message: "promo must be at most 4 characters" },
        ],
        data: undefined,
      });
    });
  });

  describe("run() coverage", () => {
    it("executes run without returning error", () => {
      const schema = v({ org: opt(str(), min(3)) });
      const result = schema({ org: "abc" });
      expect(result).toEqual({
        valid: true,
        data: { org: "abc" },
        errors: undefined,
      });
    });
  });
});
