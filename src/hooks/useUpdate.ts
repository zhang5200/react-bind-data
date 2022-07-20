/*
 * @Description: 渲染页面数据
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-08 08:36:10
 * @LastEditTime: 2022-07-18 00:16:43
 */
import { useCallback, useState } from 'react';

const useUpdate = () => {
  const [, setState] = useState({});

  return useCallback(() => setState({}), []);
};

export default useUpdate;