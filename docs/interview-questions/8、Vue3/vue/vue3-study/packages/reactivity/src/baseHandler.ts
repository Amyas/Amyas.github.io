import { isObject } from "@vue/shared";
import { reactive } from "./reactive";
import { track, trigger } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export function isReactive(value) {
  return value && value[ReactiveFlags.IS_REACTIVE];
}

export const baseHandler = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }

    // 让当前的key和effect关联起来
    track(target, key);

    // lazy proxy
    let res = Reflect.get(target, key, receiver);
    if (isObject(res)) {
      return reactive(res);
    }

    return res;
  },
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (oldValue !== value) {
      let result = Reflect.set(target, key, value, receiver);
      trigger(target, key, value);

      return result;
    }
  },
};
