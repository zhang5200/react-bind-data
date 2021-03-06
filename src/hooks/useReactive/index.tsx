/*
 * @Description: usereactive
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-08 08:35:10
 * @LastEditTime: 2022-07-22 10:16:25
 */
import { useEffect, useRef } from "react";
import useCreation from "./useCreation";
import useUpdate from "../useUpdate";

const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === "object";

// k:v 原对象:代理过的对象
const proxyMap = new WeakMap();
// k:v 代理过的对象:原对象
const rawMap = new WeakMap();

function observer<T extends Record<string, any>>(
  initialVal: T,
  cb: () => void
): T {
  const existingProxy = proxyMap.get(initialVal);

  // 添加缓存 防止重新构建proxy
  if (existingProxy) {
    return existingProxy;
  }

  // 防止代理已经代理过的对象
  // https://github.com/alibaba/hooks/issues/839
  if (rawMap.has(initialVal)) {
    return initialVal;
  }

  const proxy = new Proxy<T>(initialVal, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      return isObject(res) ? observer(res, cb) : Reflect.get(target, key);
    },
    set(target, key, val) {
      const ret = Reflect.set(target, key, val);
      cb();
      return ret;
    },
    deleteProperty(target, key) {
      const ret = Reflect.deleteProperty(target, key);
      cb();
      return ret;
    },
  });

  proxyMap.set(initialVal, proxy);
  rawMap.set(proxy, initialVal);

  return proxy;
}

function useReactive<S extends Record<string, any>>(
  initialState: S,
  value?: boolean // 是否支持直接通过value赋值
): S {
  const update = useUpdate();
  const stateRef = useRef<S>(initialState);

  const state = useCreation(() => {
    return observer(stateRef.current, () => {
      if (value) {
        // 异步更新
        setTimeout(() => {
          if (Object.keys(state).some((item) => item == "value")) {
            const newObj = state.value;
            Object.keys(state).forEach((item) => {
              Reflect.deleteProperty(state, item);
            });
            Object.keys(newObj).forEach((key) => {
              (state as any)[key] = newObj[key];
            });
            update();
          } else {
            update();
          }
        });
      } else {
        update();
      }
    });
  }, []);

  return state;
}

export default useReactive;