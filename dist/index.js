'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var _ = _interopDefault(require('lodash'));

const getGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
const toTree = (data, id, pid) => {
    let result = [];
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
        }
        else {
            result.push(item);
        }
    });
    return result;
};
const objMerge = (source, target) => {
    Object.keys(target).forEach((item) => {
        source[item] = target[item];
    });
};
var utils = {
    getGuid,
    toTree,
    objMerge
};

function mitt (n) {
  return {
    all: n = n || new Map(),
    on: function (t, e) {
      var i = n.get(t);
      i ? i.push(e) : n.set(t, [e]);
    },
    off: function (t, e) {
      var i = n.get(t);
      i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
    },
    emit: function (t, e) {
      var i = n.get(t);
      i && i.slice().map(function (n) {
        n(e);
      }), (i = n.get("*")) && i.slice().map(function (n) {
        n(t, e);
      });
    }
  };
}

const emitter = mitt();
emitter.resetOn = emitter.on;
const MittContext = React__default.createContext({ emitter });
const MittProvider = ({ children }) => {
    return (React__default.createElement(MittContext.Provider, { value: { emitter } }, children));
};
const useMitt = () => {
    const context = React.useContext(MittContext);
    const ref = React.useRef([]);
    React.useEffect(() => {
        emitter.on = (name, fn) => {
            ref.current.push({
                key: name,
                value: fn,
            });
            emitter.resetOn(name, fn);
        };
        return () => {
            ref.current.forEach((item) => {
                emitter.off(item.key, item.value);
            });
            ref.current = [];
        };
    }, []);
    return context;
};
var useMitt$1 = { MittProvider, useMitt };

const Provide = React__default.createContext({});
const ProviderContext = (props) => {
    const { children, value } = props;
    return React__default.createElement(Provide.Provider, { value: value }, children);
};
const useInject = () => React.useContext(Provide);
var useProvide = { ProviderContext, useInject };

function depsAreSame(oldDeps, deps) {
    if (oldDeps === deps)
        return true;
    for (let i = 0; i < oldDeps.length; i++) {
        if (!Object.is(oldDeps[i], deps[i]))
            return false;
    }
    return true;
}
function useCreation(factory, deps) {
    const { current } = React.useRef({
        deps,
        obj: undefined,
        initialized: false,
    });
    if (current.initialized === false || !depsAreSame(current.deps, deps)) {
        current.deps = deps;
        current.obj = factory();
        current.initialized = true;
    }
    return current.obj;
}

const useUpdate = () => {
    const [, setState] = React.useState({});
    return React.useCallback(() => setState({}), []);
};

const isObject = (value) => value !== null && typeof value === 'object';
const proxyMap = new WeakMap();
const rawMap = new WeakMap();
function observer(initialVal, cb) {
    const existingProxy = proxyMap.get(initialVal);
    if (existingProxy) {
        return existingProxy;
    }
    if (rawMap.has(initialVal)) {
        return initialVal;
    }
    const proxy = new Proxy(initialVal, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);
            return isObject(res) ? observer(res, cb) : Reflect.get(target, key);
        },
        set(target, key, val) {
            const ret = Reflect.set(target, key, val);
            cb();
            return ret;
        },
        deleteProperty(target, key) {
            const ret = Reflect.deleteProperty(target, key);
            cb();
            return ret;
        },
    });
    proxyMap.set(initialVal, proxy);
    rawMap.set(proxy, initialVal);
    return proxy;
}
function useReactive(initialState) {
    const update = useUpdate();
    const stateRef = React.useRef(initialState);
    const state = useCreation(() => {
        return observer(stateRef.current, () => {
            update();
        });
    }, []);
    return state;
}

const comparison = (oldVal, newVal) => {
    let finallyContent = true;
    try {
        const oldlist = Object.keys(oldVal);
        const newlist = Object.keys(newVal);
        if (!(oldlist.length == newlist.length)) {
            finallyContent = false;
        }
        oldlist.forEach((key) => {
            if (newlist.includes(key)) {
                const obJold = oldVal[key];
                const obJnew = newVal[key];
                if (!(typeof obJold == "object" && typeof obJnew == "object")) {
                    if (!(oldVal[key] == newVal[key])) {
                        finallyContent = false;
                    }
                }
            }
            else {
                finallyContent = false;
            }
        });
        return finallyContent;
    }
    catch (error) {
        return false;
    }
};
function useWatch(state, callBack, params) {
    const storage = React.useRef([]);
    React.useEffect(() => {
        const oldContent = storage.current[storage.current.length - 1];
        if (params?.param) {
            const value = state[params.param];
            if (_.isEqual(value, oldContent)) {
                return;
            }
            storage.current.push(_.cloneDeep(value));
        }
        else {
            if (params?.deep) {
                if (_.isEqual(state, oldContent)) {
                    return;
                }
            }
            else {
                if (comparison(state, oldContent)) {
                    return;
                }
            }
            storage.current.push(_.cloneDeep(state));
        }
        const start = storage.current[storage.current.length - 2];
        const end = storage.current[storage.current.length - 1];
        if (!params?.immediate) {
            if (!start)
                return;
        }
        if (storage.current.length > 2) {
            storage.current.shift();
        }
        callBack(start, end);
    });
    return state;
}

exports.mitt = useMitt$1;
exports.provide = useProvide;
exports.useReactive = useReactive;
exports.useWatch = useWatch;
exports.utils = utils;
