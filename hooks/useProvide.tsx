/*
 * @Description: 全局传递数据
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-15 08:16:19
 * @LastEditTime: 2022-07-15 11:53:21
 */
import React, { useContext, useState } from "react";

const ProvideContext = React.createContext({});

interface propsType {
  value: any;
  children?: any;
}

export const Provider = (props: propsType) => {
  const { children, value } = props;
  return (
    <>
      <ProvideContext.Provider value={value}>
        {children}
      </ProvideContext.Provider>
    </>
  );
};

export const useInject = () => useContext(ProvideContext);
