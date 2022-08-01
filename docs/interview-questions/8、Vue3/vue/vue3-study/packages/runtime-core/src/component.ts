import { hasOwn, isFunction } from "@vue/shared";
import { reactive } from "@vue/reactivity";

export function createComponentInstance(vnode) {
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
  };

  return instance;
}

export function setupComponent(instance) {
  const { type, props, children } = instance.vnode;
  const { data, render } = type;

  initProps(instance, props);

  instance.proxy = new Proxy(instance, instanceProxy);

  if (data) {
    if (!isFunction(data)) {
      return console.warn("data must a funciton");
    }
    instance.data = reactive(data.call({}));
  }

  instance.render = render;
}

const publicProperites = {
  $attrs: (instance) => instance.attrs,
};
const instanceProxy = {
  get(target, key, receiver) {
    const { data, props } = target;
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    }

    const getter = publicProperites[key];

    if (getter) {
      return getter(target);
    }
  },
  set(target, key, value, receiver) {
    const { data, props } = target;
    if (data && hasOwn(data, key)) {
      data[key] = value;
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
