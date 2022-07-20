/**
 *生成唯一标识符
 */
export const getGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
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

export default {
  getGuid,
  toTree,
  objMerge
}