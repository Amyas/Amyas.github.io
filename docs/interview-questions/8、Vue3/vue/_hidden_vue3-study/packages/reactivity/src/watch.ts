import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./baseHandler";

// 对value进行迭代访问，稍后执行effect时回默认取值，就会收集依赖
function traversal(value, set = new Set()) {
  // set用来存放迭代过的对象，防止出现循环引用死循环
  // 递归访问

  if (!isObject(value)) {
    return value;
  }

  if (set.has(value)) {
    return value;
  }

  set.add(value);

  for (let key in value) {
    traversal(value[key], set);
  }

  return value;
}

export function watch(source, callback) {
  let get;
  if (isReactive(source)) {
    // 创建一个effect，让这个effect收集source中的所有属性
    get = () => traversal(source);
  } else if (isFunction(source)) {
    get = source;
  }

  let oldValue;
  let cleanup;
  const onCleanup = (fn) => {
    cleanup = fn;
  };

  const job = () => {
    cleanup && cleanup();
    let newValue = effect.run();
    callback(newValue, oldValue, onCleanup);
  };

  const effect = new ReactiveEffect(get, job);
  oldValue = effect.run();
}
