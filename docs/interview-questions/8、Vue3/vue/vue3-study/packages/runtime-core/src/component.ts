import { isFunction } from "@vue/shared";
import { reactive } from "@vue/reactivity";

export function createComponentInstance(vnode) {
  const instance = {
    data: null, // 组件本身的数据
    vnode, // 组件的虚拟节点
    subTree: null, // 组件对应渲染的虚拟节点
    inMounted: false, // 组件是否挂载过
    update: null, // 组件的effect.run方法
    render: null,
  };

  return instance;
}

export function setupComponent(instance) {
  const { type, props, children } = instance.vnode;
  const { data, render } = type;

  if (data) {
    if (!isFunction(data)) {
      return console.warn("data must a funciton");
    }
    instance.data = reactive(data.call({}));
  }

  instance.render = render;
}
