/*
 * @Description: 工具类
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-17 14:11:56
 * @LastEditTime: 2022-07-17 14:13:35
 */
/**
 * 对象合并
 */
 export const objMerge = (source: any, target: any) => {
    Object.keys(target).forEach((item) => {
      source[item] = target[item];
    });
  };