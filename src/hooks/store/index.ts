/*
 * @Description:
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-24 08:27:34
 * @LastEditTime: 2022-07-30 09:34:30
 */
import { useLocalObservable, observer } from "mobx-react";
import { Store } from "./store";

const storeData = new Map();

// 用户信息
function useLocalStore<T>(
  initData?: T,
  name?: string
): [T, (item: any) => void] {
  if (typeof initData == "string" && name == null) {
    if (initData.startsWith("state:")) {
      name = initData;
      (initData as any) = null;
    }
  }

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
    function (item) {
      localStore.setValue(item);
    },
  ];
}

export default {
  observer,
  useLocalStore,
};
