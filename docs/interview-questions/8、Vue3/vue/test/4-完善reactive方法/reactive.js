const reactiveMap = new WeakMap();
const ReactiveFlags = {
  IS_REACTIVE: "__v_isReactive",
};

function reactive(target) {
  if (!isObject(target)) {
    return target;
  }

  const existing = reactiveMap.get(target);
  if (existing) {
    return existing;
  }

  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
      }
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (oldValue === value) return;

      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key);

      return result;
    },
  });

  reactiveMap.set(target, proxy);

  return proxy;
}
