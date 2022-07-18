# react-bind-data

## 前言

``` js
/**
 * 如果你是从vue转react，当你习惯了vue的双向绑定你是否会觉的react的当向数据流难以入手？虽然绝大部分功能都可以通过useEffect和useState来实现，
 * 但当场景足够复杂的时候你是否感觉react的* 单向数据流开发起来相当吃力。为了解决在复杂场景的开发难度，通过react的基础hooks实现vue的核心功能，让
 * 你开发复杂组件逻辑依然简单，不用在写复杂的回调极大增加了开发效率。
 */
```

## 实现 vue 双向绑定

### useReactive

```js
/**
 * react调用setState就可以调用渲染功能，useReactive的核心原理是通过，proxy代理state
 * 当你赋予值内容的时候会调用set方法调用setState函数重新刷新页面数据
 * 类似于vue3中的reactive，vue2中的data，数据具有双向绑定功能
 */
const App = () => {
    const state = useReactive({name: ''})
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
 * react要监听数据时否发生改变需要调用setState方法，很可惜的是如果的使用的是useReactive你
 * 将无法监听数据发生变化，这里useWatch()就是用来监听useReactive数据是否发生改变
 */
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

### 实现 vue 全局 bus

### useMitt

```js
/**
 * useMitt实现了跨组件的方法调用，通过发布订阅实现
 */
const App = () => {
  const state = useReactive({ name: "" });
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
  const mitt = useMitt();

  useEffect(() => {
    mitt.emit("event"); // 调用事件
  }, []);

  return <>{inject.name}</>;
};

/**
 *  mitt在react中注册事件
 */
const Children2 = () => {
  const mitt = useMitt();

  useEffect(() => {
    mitt.on("event", () => {}); // 注册事件
  }, []);

  return <>{inject.name}</>;
};
```

### 实现 vuex 双向绑定

### reactx

```js
/**
 * 包裹需要透传的组件
 */
const App = () => {
  const { ReactxProvider } = useReactx();
  return (
    <ReactxProvider>
      <Children1></Children1>
      <Children2></Children2>
    </ReactxProvider>
  );
};

/**
 * 具体addressBook的内容可以查看reactx modules下的申明信息
 */
const Children1 = () => {
  const sotre: any = useStore();

  return <>{JSON.stringify(sotre.addressBook?.state)}</>;
};

/**
 *  通过方法调用改变action的内容
 */
const Children2 = () => {
  const sotre: any = useStore();
  return (
    <>
      <button
        onClick={() => {
          // 通过调用action方法可以直接改变state的内容
          sotre.addressBook.actions.good();
        }}
      >
        改变a组件的内容
      </button>
    </>
  );
};
```
