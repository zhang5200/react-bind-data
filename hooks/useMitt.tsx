/*
 * @Description: 全局bus
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-15 08:16:19
 * @LastEditTime: 2022-07-15 08:29:25
 */
import React, { useContext } from "react";
import mitt, { Emitter } from "mitt";

const emitter: Emitter = mitt();

export interface MittContextType {
  emitter: Emitter;
}

const MittContext = React.createContext<MittContextType>({ emitter });

export const MittProvider: React.FC<any> = ({ children }) => {
  return (
    <MittContext.Provider value={{ emitter }}>{children}</MittContext.Provider>
  );
};

export const useMitt = (): MittContextType => useContext(MittContext);
