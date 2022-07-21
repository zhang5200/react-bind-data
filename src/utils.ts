/*
 * @Description: 工具类
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-20 18:42:11
 * @LastEditTime: 2022-07-22 07:42:27
 */
import { add, bignumber, divide, format, multiply, subtract } from "mathjs";

/**
 *生成唯一标识符
 */
export const getGuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 转树形结构
 */
export const toTree = (data: any, id: any, pid: any) => {
  let result: any = [];
  if (!Array.isArray(data)) {
    return result;
  }
  data.forEach((item) => {
    delete item.children;
  });
  let map = {};
  data.forEach((item) => {
    map[item[id]] = item;
  });
  data.forEach((item) => {
    let parent = map[item[pid]];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};

/**
 * 对象合并
 */
export const objMerge = (source: any, target: any) => {
  Object.keys(target).forEach((item) => {
    source[item] = target[item];
  });
};

// 加
export const numAdd = (start: string | number, end: string | number) => {
  return format(add(bignumber(start), bignumber(end)), {
    notation: "fixed",
  });
};

// 减
export const numSub = (start: string | number, end: string | number) => {
  return format(subtract(bignumber(start), bignumber(end)), {
    notation: "fixed",
  });
};

// 乘
export const numMul = (start: string | number, end: string | number) => {
  return format(multiply(bignumber(start), bignumber(end)), {
    notation: "fixed",
  });
};

// 除
export const numDiv = (start: string | number, end: string | number) => {
  return format(divide(bignumber(start), bignumber(end)), {
    notation: "fixed",
  });
};

export default {
  getGuid,
  toTree,
  objMerge,
  calculate: {
    numAdd,
    numSub,
    numMul,
    numDiv,
  },
};
