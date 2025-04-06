export type R = (v: unknown, f: string) => string | undefined;
export type L = R[];
export type S = Record<string, L>;
export type E = { field: string; message: string };

export const v = <T extends Record<string, unknown>>(s: S) => {
  return (
    d: T,
  ):
    | {
        valid: true;
        data: T;
        errors: undefined;
      }
    | {
        valid: false;
        data: undefined;
        errors: E[];
      } => {
    const e: E[] = [];

    for (const f in s) {
      const r = s[f],
        v = d[f];
      for (const fn of r) {
        const m = fn(v, f);
        if (m) {
          e.push({ field: f, message: m });
          break;
        }
      }
    }

    return e.length
      ? { valid: false, errors: e, data: undefined }
      : { valid: true, data: d, errors: undefined };
  };
};

export const req = (...r: R[]): L => [
  (v, f) =>
    v === undefined || v === null || v === "" ? `${f} is required` : void 0,
  ...r,
];

export const opt = (...r: R[]): L => [
  (v, f) => (v === undefined || v === null || v === "" ? void 0 : run(v, f, r)),
];

type M = string | ((v: unknown) => string);

const _ = (d: string, v: unknown, m?: M) =>
  typeof m === "function" ? m(v) : (m ?? d);

export const str =
  (m?: M): R =>
  (v, f) =>
    typeof v !== "string" ? _(`${f} must be a string`, v, m) : void 0;

export const num =
  (m?: M): R =>
  (v, f) =>
    typeof v !== "number" ? _(`${f} must be a number`, v, m) : void 0;

export const bool =
  (m?: M): R =>
  (v, f) =>
    typeof v !== "boolean" ? _(`${f} must be a boolean`, v, m) : void 0;

export const min =
  (n: number, m?: M): R =>
  (v, f) => {
    const t = typeof v,
      s = t === "string" ? String(v).length : v;
    if ((t === "string" || t === "number") && Number(s) < n)
      return _(
        `${f} must be at least ${n}${t === "string" ? " characters" : ""}`,
        v,
        m,
      );
  };

export const max =
  (n: number, m?: M): R =>
  (v, f) => {
    const t = typeof v,
      s = t === "string" ? String(v).length : v;
    if ((t === "string" || t === "number") && Number(s) > n)
      return _(
        `${f} must be at most ${n}${t === "string" ? " characters" : ""}`,
        v,
        m,
      );
  };

export const eq =
  (x: unknown, m?: M): R =>
  (v, f) =>
    v !== x ? _(`${f} is invalid`, v, m) : void 0;

export const ne =
  (x: unknown, m?: M): R =>
  (v, f) =>
    v === x ? _(`${f} is invalid`, v, m) : void 0;

export const rgx =
  (r: RegExp, m?: M): R =>
  (v, f) =>
    typeof v === "string" && !r.test(v) ? _(`${f} is invalid`, v, m) : void 0;

export const email =
  (m?: M): R =>
  (v, f) =>
    typeof v === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? _(`${f} must be a valid email`, v, m)
      : void 0;

export const and =
  (...r: R[]): R =>
  (v, f) => {
    for (const c of r) {
      const m = c(v, f);
      if (m) return m;
    }
  };

export const or =
  (...r: R[]): R =>
  (v, f) => {
    const s = r.map((c) => c(v, f));
    return s.some((r) => r === void 0) ? void 0 : s.find((r) => r);
  };

const run = (v: unknown, f: string, r: R[]): string | undefined => {
  for (const c of r) {
    const m = c(v, f);
    if (m) return m;
  }
};
