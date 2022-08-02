/*
 * @Description: 防抖
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-08-02 15:41:27
 * @LastEditTime: 2022-08-02 16:13:03
 */
import { useEffect, useRef } from "react";

function antiShake(time: number) {
  let timeSave: any = null;
  function callback(callback: any) {
    clearTimeout(timeSave);
    timeSave = setTimeout(() => {
      callback();
    }, time);
  }
  return callback;
}

const useAntiShake = (
  time: number, // 防抖时间
  callBack: () => void, // 回调函数
  firstTrigger: boolean = true // true第一次执行
) => {
  const saveFn = useRef(antiShake(time));
  const first = useRef<boolean>(true);

  const trigger = () => {
    if (firstTrigger) {
      if (first.current && firstTrigger) {
        callBack();
        first.current = false;
      }
      saveFn.current(() => {
        first.current = true;
      });
    } else {
      saveFn.current(() => {
        callBack();
      });
    }
  };

  return trigger;
};

export default useAntiShake;
