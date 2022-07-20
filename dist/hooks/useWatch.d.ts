declare function useWatch<T>(state: T, callBack: (start?: T, end?: T) => void, params?: {
    param?: string;
    immediate?: boolean;
    deep?: boolean;
}): T;
export default useWatch;
