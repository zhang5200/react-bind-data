export declare const getGuid: () => string;
export declare const toTree: (data: any, id: any, pid: any) => any;
export declare const objMerge: (source: any, target: any) => void;
export declare const numAdd: (start: string | number, end: string | number) => string;
export declare const numSub: (start: string | number, end: string | number) => string;
export declare const numMul: (start: string | number, end: string | number) => string;
export declare const numDiv: (start: string | number, end: string | number) => string;
export declare const sumAdd: (array: any[]) => any;
declare const _default: {
    getGuid: () => string;
    toTree: (data: any, id: any, pid: any) => any;
    objMerge: (source: any, target: any) => void;
    timeout: (time: number) => Promise<unknown>;
    calculate: {
        numAdd: (start: string | number, end: string | number) => string;
        numSub: (start: string | number, end: string | number) => string;
        numMul: (start: string | number, end: string | number) => string;
        numDiv: (start: string | number, end: string | number) => string;
        sumAdd: (array: any[]) => any;
    };
};
export default _default;
