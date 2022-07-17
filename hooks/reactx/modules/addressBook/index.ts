import { getKeyThenIncreaseKey } from "antd/lib/message";

/*
 * @Description: 子模块
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-17 08:59:01
 * @LastEditTime: 2022-07-17 18:08:37
 */
export default {
  state: { agea: 1, ageb: 2 },
  getters: {
    good(state: any) {
      return state.agea + state.ageb;
    },
  },
  actions: {
    good(state: any) {
      state.ageb = Math.random();
    },
  },
};
