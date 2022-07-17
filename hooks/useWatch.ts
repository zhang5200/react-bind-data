/*
 * @Description: 自定义监听需要配合ahooks中的useReactve实现类vue的双向绑定
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-11 00:24:23
 * @LastEditTime: 2022-07-16 17:02:10
 */
import _ from "lodash";
import { useEffect, useRef } from "react";

// 浅比较
const comparison = (oldVal: any, newVal: any) => {
  let finallyContent = true;
  try {
    const oldlist = Object.keys(oldVal);
    const newlist = Object.keys(newVal);
    // key个数是否相同
    if (!(oldlist.length == newlist.length)) {
      finallyContent = false;
    }
    oldlist.forEach((key) => {
      // 判断新的key在旧内容中是否存在
      if (newlist.includes(key)) {
        const obJold = oldVal[key];
        const obJnew = newVal[key];
        if (!(typeof obJold == "object" && typeof obJnew == "object")) {
          // 如果key相同比较一下内容是否相同
          if (!(oldVal[key] == newVal[key])) {
            finallyContent = false;
          }
        }
      } else {
        finallyContent = false;
      }
    });
    return finallyContent;
  } catch (error) {
    return false;
  }
};

function useWatch<T>(
  state: T,
  callBack: (start?: T, end?: T) => void,
  params?: {
    param?: string; // 监听单个属性
    immediate?: boolean; // true第一次触发回调
    deep?: boolean; // 是否深入监听
  }
) {
  // 储存历史记录
  const storage = useRef<T[]>([]);

  useEffect(() => {
    const oldContent = storage.current[storage.current.length - 1];

    if (params?.param) {
      // 监听单个参数
      const value = (state as any)[params.param];
      if (_.isEqual(value, oldContent)) {
        return;
      }
      storage.current.push(_.cloneDeep(value));
    } else {
      if (params?.deep) {
        // 深入监听
        if (_.isEqual(state, oldContent)) {
          return;
        }
      } else {
        // 浅监听
        if (comparison(state, oldContent)) {
          return;
        }
      }
      storage.current.push(_.cloneDeep(state));
    }

    const start = storage.current[storage.current.length - 2];
    const end = storage.current[storage.current.length - 1];

    // 没有值说明是初始化第一次
    if (!params?.immediate) {
      if (!start) return;
    }

    if (storage.current.length > 2) {
      storage.current.shift();
    }

    // 传递旧值跟新值
    callBack(start, end);
  });
  return state;
}

export default useWatch;
