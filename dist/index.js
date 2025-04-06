export const v = (s) => {
    return (d) => {
        const e = [];
        for (const f in s) {
            const r = s[f], v = d[f];
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
export const req = (...r) => [
    (v, f) => v === undefined || v === null || v === "" ? `${f} is required` : void 0,
    ...r,
];
export const opt = (...r) => [
    (v, f) => (v === undefined || v === null || v === "" ? void 0 : run(v, f, r)),
];
export const str = () => (v, f) => typeof v !== "string" ? `${f} must be a string` : void 0;
export const num = () => (v, f) => typeof v !== "number" ? `${f} must be a number` : void 0;
export const bool = () => (v, f) => typeof v !== "boolean" ? `${f} must be a boolean` : void 0;
export const min = (n) => (v, f) => {
    const t = typeof v, s = t === "string" ? String(v).length : v;
    if ((t === "string" || t === "number") && Number(s) < n)
        return `${f} must be at least ${n}${t === "string" ? " characters" : ""}`;
};
export const max = (n) => (v, f) => {
    const t = typeof v, s = t === "string" ? String(v).length : v;
    if ((t === "string" || t === "number") && Number(s) > n)
        return `${f} must be at most ${n}${t === "string" ? " characters" : ""}`;
};
export const eq = (x) => (v, f) => v !== x ? `${f} is invalid` : void 0;
export const ne = (x) => (v, f) => v === x ? `${f} is invalid` : void 0;
export const rgx = (r) => (v, f) => typeof v === "string" && !r.test(v) ? `${f} is invalid` : void 0;
export const email = () => (v, f) => typeof v === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    ? `${f} must be a valid email`
    : void 0;
export const and = (...r) => (v, f) => {
    for (const c of r) {
        const m = c(v, f);
        if (m)
            return m;
    }
};
export const or = (...r) => (v, f) => {
    const s = r.map((c) => c(v, f));
    return s.some((r) => r === void 0) ? void 0 : s.find((r) => r);
};
const run = (v, f, r) => {
    for (const c of r) {
        const m = c(v, f);
        if (m)
            return m;
    }
};
