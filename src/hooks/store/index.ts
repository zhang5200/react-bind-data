/*
 * @Description: 设置响应式
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-24 08:27:34
 * @LastEditTime: 2022-07-28 00:06:49
 */
import { useLocalObservable, observer } from "mobx-react";
import { Store } from "./store";
const storeData = new Map();

// 用户信息
const useLocalStore = (initData?: any, name?: string) => {
  const localStore = useLocalObservable(() => {
    if (!name) {
      return new Store(initData);
    }
    if (storeData.has(name)) {
      const getStore = storeData.get(name);
      return getStore;
    } else {
      const newStore = new Store(initData);
      storeData.set(name, newStore);
      return newStore;
    }
  });
  return [
    localStore.value,
    function (item: any) {
      localStore.setValue(item);
    },
  ];
};

export default {
  useLocalStore,
  observer,
};
