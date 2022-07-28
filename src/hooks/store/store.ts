/*
 * @Description: 定义状态
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-25 08:17:07
 * @LastEditTime: 2022-07-28 08:12:58
 */
import { action, configure, makeObservable, observable} from "mobx";

// 可以在任意情况下修改状态
configure({ enforceActions: "never"}) 

export class Store {
  value = {};

  constructor(initvalue?: any) {
    makeObservable(this, {
      value: observable, 
      setValue: action,
    });
    if (initvalue) {
      this.value = initvalue;
    }
  }

  // 替换对象
  setValue(v: any) {
    this.value = v;
  }
}
