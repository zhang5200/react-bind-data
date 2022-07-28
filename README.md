# react-db-bind

## 前言

你是否从 vue 转 react？当你习惯了 vue 的双向绑定你是否会觉的 react 的单向数据流难以入手？在开发公共组件或相对简单的业务场景单向数据流通过 props 传递更加清晰可预见，但是当场景足够复杂且各种组件相互交织的业务场景那就皆然不同了，解决各种组件数据交互的同时你还要关注数据的回调这无疑增加了开发难度。为了解决 react 在复杂场景的开发难度，通过 react 的基础 hooks 实现 vue 的核心功能，让你开发复杂组件逻辑依然简单，不用在编写复杂的回调，极大提高了 react 开发效率。（在编写公共组件或者简单的业务场景并不推荐使用，会提高数据改变的不可预知性，给后续维护带来一定困难）

[github 地址](https://github.com/zhang5200/react-bind-data 源码)

## 实现 vue 双向绑定

### useReactive

```js
import { useReactive } from 'react-db-bind';
/**
 * react调用setState就可以调用渲染功能，useReactive的核心原理是通过，proxy代理state
 * 当你赋予值内容的时候会调用set方法调用setState函数重新刷新页面数据类似于vue3中的reac
 * tive，vue2中的data，数据具有双向绑定功能
 */
const App = () => {
    /**
     * 第二个参数true默认支持通过value覆盖当前已经有的内容
     */
    const state = useReactive({name: ''}, true)
    /**
     * 这里做了个特殊属性处理value，useReactive一旦申明你是无法直接替换整个对象，这个带来了
     * 一定的问题，如果useReactive在子组件通过属性的方式获取，你将不得已重新申明一个变量接受
     * 如申明useReactive({data: ''})，传递的属性改变data的内容而重新渲染子组件。为了让结果
     * 更优雅你可以直接通过value赋予一个新对象，这样你就能覆盖当前已经申明的对象
     */
    useEffect(() => {
     state.value = { good:'' }
    },[])

    // 只要button改变name的内容就会重新渲染页面
    return <>
      <span>{state.name}<span>
      <button onChange={()=>state.name='测试'}>改变</button>
     <>
}
```

## 实现 vue 数据监听

### useWatch

```js
/**
 * react要监听数据时否发生改变需要调用setState方法，很可惜的是如果你使用的是useReactiv你
 * 将无法监听数据发生变化，这里useWatch()就是用来监听useReactive数据是否发生改变
 */
import { useReactive } from 'react-db-bind';

const App = () => {
  const state = useReactive({name: ''})

   // 该功能实现vue中的watch功能
   useWatch(state, (oldVal,newVal)=>{},{
       deep: true, // 是否深入监听（默认是浅监听）
       immediate: true, // 第一次是否促发
       param: '' // 如果监听的是某个属性的内容你需要传入参数
   })

  return <>
    <span>{state.name}<span>
    <button onChange={()=>state.name='测试'}>改变</button>
    <>
}
```

## 实现 vue 数据透传 provide 和 inject

### useProvide

```js
import { useReactive, provide } from "react-db-bind";
const { Provider, useInject } = provide;

/**
 * 通过Provides包裹，state数据会下传给所有的子组件，无需一级一级传递数据
 * 使用起来相当简便你无需考虑数据传递
 */
const App = () => {
  const state = useReactive({ name: "" });
  return (
    <Provider value={state}>
      <Children></Children>
    </Provider>
  );
};

/**
 * 子组件通过useInject获取内容，由于是双向绑定你也可以直接改变inject的内容刷新全局数据
 */
const Children = () => {
  const inject = useInject();
  return <>{inject.name}</>;
};
```

## 实现 vue 全局 bus

### useMitt

```js
import { useReactive, provide } from "react-db-bind";
const { useMitt, MittProvider } = mitt;

/**
 * useMitt实现了跨组件的方法调用，通过发布订阅实现，内部做了特殊处理当页面
 * 被卸载的时候会自动清除emitter.on事件，不会重复注册
 */
const App = () => {
  return (
    <MittProvider>
      <Children1></Children1>
      <Children2></Children2>
    </MittProvider>
  );
};

/**
 * mitt在react中发布事件
 */
const Children1 = () => {
  const { emitter } = useMitt();

  useEffect(() => {
    emitter.emit("event"); // 调用事件
  }, []);

  return <>{inject.name}</>;
};

/**
 *  mitt在react中注册事件
 */
const Children2 = () => {
  const { emitter } = useMitt();

  useEffect(() => {
    emitter.on("event", () => {}); // 注册事件
  }, []);

  return <>{inject.name}</>;
};
```

## 双向绑定plush

### useLocalStore
``` js
import { store } from "react-db-bind";
const { observer, useLocalStore } = store;
/**
 * 该双向绑定是基于mobx的双向绑定进行封装，使用的时候会比useReactive更加方便
 */
const App = () => {
  /**
   * 与useState使用方式相同，区别在于直接修改state内容会渲染页面数据（数据双向绑定），同时多出了setState方法会直接改变state的内容
   * 如果用useEffect监听则会触发useEffect方法
   */
  const [state, setState] = useLocalStore({ name: "李四" });
  return (
    <div>
      {JSON.stringify(good)}
      <button
        onClick={() => {
          state.name = Math.random() ;
        }}
      >
        测试响应
      </button>
    </div>
  );
};
export default observer(App);

/**
 * 全局共享state
 */
const App = () => {
  /**
   * useLocalStore多出了第二个参数标记如果加入参数当前staet全局共享
   * 这里用user做了标记
   */
  const [state, setState] = useLocalStore({ name: "李四" }, 'user');
  
  return (
    <div>
      <button
        onClick={() => {
          state.name = Math.random() ;
        }}
      >
        测试响应
      </button>
    </div>
  );
};
export default observer(App);

const Children = () => {
  /**
   * 在任意的组件中，只要通过user标记就能找到对应的组件state状态
   */
  const [state, setState] = useLocalStore(null, 'user');
  return (
    <div>
      <button
        onClick={() => {
          // 当前的修改会触发全局任意一处有使用useLocalStore渲染
          state.name = Math.random() ;
        }}
      >
        测试响应
      </button>
    </div>
  );
};



```

