import { hasOwn, isFunction, isObject } from "@vue/shared";
import { proxyRefs, reactive } from "@vue/reactivity";
import { ShapeFlags } from "./createVNode";

export let instance = null;

export const getCurrentInstance = () => instance;
export const setCurrentInstance = (i) => (instance = i);

export function createComponentInstance(vnode, parent) {
  const instance = {
    data: null, // 组件本身的数据
    vnode, // 组件的虚拟节点
    subTree: null, // 组件对应渲染的虚拟节点
    inMounted: false, // 组件是否挂载过
    update: null, // 组件的effect.run方法
    render: null,
    propsOptions: vnode.type.props || {}, // props类型生命
    props: {}, // 用户接收生命的属性
    attrs: {}, // props没有接收的放到这里
    proxy: null,
    setupState: {}, // setup返回的是对象则给这个对象赋值
    slots: {}, //存放组件所有插槽信息
    parent, // 标记当前组件的父亲
    provides: parent ? parent.provides : Object.create(null), // 父->儿->孙用同一个对象
  };

  return instance;
}

function initSlots(instance, children) {
  if (instance.vnode.shapeFlags & ShapeFlags.SLOTS_CHILDREN) {
    instance.slots = children; // 将用户的children 映射到 slots上
  }
}

export function setupComponent(instance) {
  const { type, props, children } = instance.vnode;
  const { data, render, setup } = type;

  initProps(instance, props);

  initSlots(instance, children);

  instance.proxy = new Proxy(instance, instanceProxy);

  if (data) {
    if (!isFunction(data)) {
      return console.warn("data must a funciton");
    }
    instance.data = reactive(data.call({}));
  }

  if (setup) {
    const context = {
      emit: (eventName, ...args) => {
        const invoker = instance.vnode.props[eventName];
        // 调用绑定的事件
        invoker && invoker(...args);
      },
      attrs: instance.attrs,
      slots: instance.slots,
    };
    // setup在执行的时候有两个参数
    setCurrentInstance(instance);
    const setupResult = setup(instance.props, context);
    setCurrentInstance(null);

    if (isFunction(setupResult)) {
      instance.render = setupResult;
    } else if (isObject(setupResult)) {
      instance.setupState = proxyRefs(setupResult);
    }
  }

  if (!instance.render) {
    if (render) {
      instance.render = render;
    } else {
      // 模版编译，赋值给render
    }
  }
}

const publicProperites = {
  $attrs: (instance) => instance.attrs,
  $slots: (instance) => instance.slots,
};
const instanceProxy = {
  get(target, key, receiver) {
    const { data, props, setupState } = target;
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (setupState && hasOwn(setupState, key)) {
      return setupState[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    }

    const getter = publicProperites[key];

    if (getter) {
      return getter(target);
    }
  },
  set(target, key, value, receiver) {
    const { data, props, setupState } = target;
    if (data && hasOwn(data, key)) {
      data[key] = value;
    } else if (setupState && hasOwn(setupState, key)) {
      setupState[key] = value;
    } else if (props && hasOwn(props, key)) {
      console.warn("props not update");
      return false;
    }
    return true;
  },
};

function initProps(instance, rawProps) {
  const props = {};
  const attrs = {};

  const options = instance.propsOptions;

  if (rawProps) {
    for (let key in rawProps) {
      const value = rawProps[key];
      // 应该校验值的类型是否符合类型
      if (key in options) {
        props[key] = value;
      } else {
        attrs[key] = value;
      }
    }
  }

  instance.props = reactive(props); // 内部用的是浅响应式，只有外层修改才会触发更新
  instance.attrs = attrs; // 默认非响应式
}
