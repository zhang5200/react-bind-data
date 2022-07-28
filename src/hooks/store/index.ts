/*
 * @Description:
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-24 08:27:34
 * @LastEditTime: 2022-07-28 15:19:06
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
      if (initData != null) {
        getStore.setValue(initData);
      }
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
  observer,
  useLocalStore,
};