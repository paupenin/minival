export type R = (v: unknown, f: string) => string | undefined;
export type L = R[];
export type S = Record<string, L>;
export type E = {
    field: string;
    message: string;
};
export declare const v: <T extends Record<string, unknown>>(s: S) => (d: T) => {
    valid: true;
    data: T;
    errors: undefined;
} | {
    valid: false;
    data: undefined;
    errors: E[];
};
export declare const req: (...r: R[]) => L;
export declare const opt: (...r: R[]) => L;
type M = string | ((v: unknown) => string);
export declare const str: (m?: M) => R;
export declare const num: (m?: M) => R;
export declare const bool: (m?: M) => R;
export declare const min: (n: number, m?: M) => R;
export declare const max: (n: number, m?: M) => R;
export declare const eq: (x: unknown, m?: M) => R;
export declare const ne: (x: unknown, m?: M) => R;
export declare const rgx: (r: RegExp, m?: M) => R;
export declare const email: (m?: M) => R;
export declare const and: (...r: R[]) => R;
export declare const or: (...r: R[]) => R;
export {};
