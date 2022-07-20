/*
 * @Description: 全局传递数据
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-15 08:16:19
 * @LastEditTime: 2022-07-21 07:38:00
 */
import React, { useContext, useState } from "react";

const Provide = React.createContext({});

interface propsType {
  value?: any;
  children?: any;
}

export const Provider = (props?: propsType) => {
  const { children, value } = props;
  return <Provide.Provider value={value}>{children}</Provide.Provider>;
};

export const useInject = () => useContext(Provide);

export default { Provider, useInject };
