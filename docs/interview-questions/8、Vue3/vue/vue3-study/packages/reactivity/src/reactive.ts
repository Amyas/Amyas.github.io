import { isObject } from "@vue/shared";
import { baseHandler, ReactiveFlags } from "./baseHandler";

const reactiveMap = new WeakMap(); // key必须是对象，弱引用

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
  const proxy = new Proxy(target, baseHandler);

  reactiveMap.set(target, proxy);

  return proxy;
}
