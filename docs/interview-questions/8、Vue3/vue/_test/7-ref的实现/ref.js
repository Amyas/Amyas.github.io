function ref(value) {
  return new RefImpl(value);
}

function toRef(target, key) {
  return new ObjectImpl(target, key);
}

function toRefs(target) {
  const result = {};
  for (let key in target) {
    result[key] = toRef(target, key);
  }
  return result;
}

function proxyRefs(object) {
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

class ObjectImpl {
  constructor(target, key) {
    this.target = target;
    this.key = key;
    this.__v_isRef = true;
  }
  get value() {
    return this.target[this.key];
  }
  set value(newValue) {
    this.target[this.key] = newValue;
  }
}

function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

class RefImpl {
  constructor(rawValue) {
    this.rawValue = rawValue;
    this._value = toReactive(rawValue);
    this.deps = null;
    this.__v_isRef = true;
  }
  get value() {
    if (activeEffect) {
      trackEffects(this.deps || (this.deps = new Set()));
    }
    return this._value;
  }
  set value(newValue) {
    if (newValue === this.rawValue) return;
    this._value = toReactive(newValue);
    this.rawValue = newValue;
    triggerEffects(this.deps);
  }
}
