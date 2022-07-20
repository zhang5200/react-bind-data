/*
 * @Description: 全局bus
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-15 08:16:19
 * @LastEditTime: 2022-07-20 12:55:19
 */
import React, { useContext, useEffect, useRef } from "react";
import mitt, { Emitter } from "mitt";

interface newEmitter extends Emitter<any> {
  resetOn?: any;
}

const emitter: newEmitter = mitt();

export interface MittContextType {
  emitter: Emitter<any>;
}

// 防止重复的事件组册
emitter.resetOn = emitter.on;

const MittContext = React.createContext<MittContextType>({ emitter });

export const MittProvider: React.FC<any> = ({ children }) => {
  return (
    <MittContext.Provider value={{ emitter }}>{children}</MittContext.Provider>
  );
};

export const useMitt = () => {
  const context = useContext(MittContext);
  const ref = useRef<any[]>([]);

  useEffect(() => {
    emitter.on = (name: string, fn: any) => {
      ref.current.push({
        key: name,
        value: fn,
      });
      emitter.resetOn(name, fn);
    };

    // 卸载
    return () => {
      // 卸载删除方法
      ref.current.forEach((item) => {
        emitter.off(item.key, item.value);
      });
      ref.current = [];
    };
  }, []);
  return context;
};

export default { MittProvider, useMitt };
