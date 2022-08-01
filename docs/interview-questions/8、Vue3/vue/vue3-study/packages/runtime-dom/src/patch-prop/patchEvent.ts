function createInvoker(preValue) {
  const invoker = (e) => {
    invoker.value(e);
  };
  invoker.value = preValue; // 后续修改value的引用，就可以调用不同的逻辑
  return invoker;
}

export function patchEvent(el, key, nextValue) {
  const invokers = el._vei || (el._vei = {}); // __vei === vueEventInvokers

  const exitingInvoker = invokers[key];
  if (exitingInvoker && nextValue) {
    // 进行换绑
    exitingInvoker.value = nextValue;
  } else {
    const eventName = key.slice(2).toLowerCase();
    if (nextValue) {
      // 不存在缓存的情况
      const invoker = createInvoker(nextValue);
      invokers[key] = invoker;
      el.addEventListener(eventName, invoker);
    } else if (exitingInvoker) {
      // 没有新值，但是之前绑定过
      el.removeEventListener(eventName, exitingInvoker);
      invokers[key] = null;
    }
  }
}
