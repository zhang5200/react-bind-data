import { observer } from "mobx-react";
declare function useLocalStore<T>(initData?: T, name?: string): [T, (item: any) => void];
declare const _default: {
    observer: typeof observer;
    useLocalStore: typeof useLocalStore;
};
export default _default;
