import { observer } from "mobx-react";
declare function useLocalStore<T>(initData?: T | string, name?: string): [T & {
    [name: string]: any;
}, (item: any) => void];
declare const _default: {
    observer: typeof observer;
    useLocalStore: typeof useLocalStore;
};
export default _default;
