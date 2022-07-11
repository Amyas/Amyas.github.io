import { isObject } from "@vue/shared";

const reactiveMap = new WeakMap(); // key必须是对象，弱引用
const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export function reactive(target) {
  if (!isObject(target)) {
    return target;
  }

  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  const existing = reactiveMap.get(target);
  if (existing) {
    return existing;
  }

  // es6中的proxy
  // proxy一般搭配reflect使用，保证this指向正确
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
      }
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver);
    },
  });

  reactiveMap.set(target, proxy);

  return proxy;
}
