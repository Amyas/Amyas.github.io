import { isObject } from "@vue/shared";
import { trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

export function ref(value) {
  return new RefImpl(value);
}

export function proxyRefs(object) {
  return new Proxy(object, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      return result.__v_isRef ? result.value : result;
    },
    set(target, key, value, receiver) {
      if (target[key].__v_isRef) {
        target[key].value = value;
        return true;
      }
      return Reflect.set(target, key, value, receiver);
    },
  });
}

export function toRefs(target) {
  let result = {};
  for (let key in target) {
    result[key] = toRef(target, key);
  }
  return result;
}

export function toRef(target, key) {
  return new ObjectImpl(target, key);
}

class ObjectImpl {
  private __v_isRef = true;
  constructor(public target, public key) {}
  get value() {
    return this.target[this.key];
  }
  set value(newValue) {
    this.target[this.key] = newValue;
  }
}

export function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

class RefImpl {
  private _value;
  private dep;
  private __v_isRef = true;
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }
  get value() {
    trackEffects(this.dep || (this.dep = new Set()));
    return this._value;
  }
  set value(newValue) {
    if (newValue === this.rawValue) return;
    this._value = toReactive(newValue);
    this.rawValue = newValue;
    triggerEffects(this.dep);
  }
}
