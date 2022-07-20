/*
 * @Description: 
 * @Author: 张正兴
 * @LastEditors: 张正兴
 * @Date: 2022-07-14 09:09:13
 * @LastEditTime: 2022-07-20 07:21:10
 */
import type { DependencyList } from 'react';
import { useRef } from 'react';

function depsAreSame(oldDeps: DependencyList, deps: DependencyList): boolean {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
}

export default function useCreation<T>(factory: () => T, deps: DependencyList) {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }
  return current.obj as T;
}