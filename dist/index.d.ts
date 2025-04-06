export type R = (v: unknown, f: string) => string | undefined;
export type L = R[];
export type S = Record<string, L>;
export type E = {
    field: string;
    message: string;
};
export type V = {
    valid: true;
    data: Record<string, unknown>;
    errors: undefined;
} | {
    valid: false;
    errors: E[];
    data: undefined;
};
export declare const v: (s: S) => (d: Record<string, unknown>) => V;
export declare const req: (...r: R[]) => L;
export declare const opt: (...r: R[]) => L;
export declare const str: () => R;
export declare const num: () => R;
export declare const bool: () => R;
export declare const min: (n: number) => R;
export declare const max: (n: number) => R;
export declare const eq: (x: unknown) => R;
export declare const ne: (x: unknown) => R;
export declare const rgx: (r: RegExp) => R;
export declare const email: () => R;
export declare const and: (...r: R[]) => R;
export declare const or: (...r: R[]) => R;
