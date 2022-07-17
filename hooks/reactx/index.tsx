/*
 * @Description: 全局数据共享
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-17 08:06:15
 * @LastEditTime: 2022-07-17 18:14:21
 */
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import useReactive from "../useReactive";
import { objMerge } from "../utils/utils";
import addressBook from "./modules/addressBook";
import daily from "./modules/daily";

const ProvideContext = React.createContext({
  state: {},
  actions: {},
  getters: {},
});

const pointing = (modal: any, update: any) => {
  Object.keys(modal.getters).forEach((key) => {
    modal.getters[key] = modal.getters[key].bind(null, modal.state);
  });
  Object.keys(modal.actions).forEach((key) => {
    const proxy = new Proxy(modal.state, {
      set: function (target, key, receiver) {
        update({});
        return Reflect.set(target, key, receiver);
      },
    });

    modal.actions[key] = modal.actions[key].bind(null, proxy);
  });
};

const cycleData = (objects: any, update: any) => {
  Object.keys(objects).forEach((key) => {
    pointing(objects[key], update);
  });
  return objects;
};

interface propsType {
  children?: any;
}

export const useReactx = () => {
  const [, update] = useState();

  const state: any = useReactive(
    cycleData(
      {
        addressBook,
        daily,
      },
      update
    )
  );

  const ReactxProvider = (props: propsType) => {
    const { children } = props;
    return (
      <ProvideContext.Provider value={state}>
        {children}
      </ProvideContext.Provider>
    );
  };

  return { ReactxProvider };
};

export const useStore = () => useContext(ProvideContext);
