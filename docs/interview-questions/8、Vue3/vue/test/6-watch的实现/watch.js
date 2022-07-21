function traversal(value, set = new Set()) {
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

function watch(source, callback) {
  let get;

  if (isReactive(source)) {
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
