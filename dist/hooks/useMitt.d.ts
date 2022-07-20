import React from "react";
import { Emitter } from "mitt";
export interface MittContextType {
    emitter: Emitter<any>;
}
export declare const MittProvider: React.FC<any>;
export declare const useMitt: () => MittContextType;
declare const _default: {
    MittProvider: React.FC<any>;
    useMitt: () => MittContextType;
};
export default _default;
