let callbacks = [];
let waiting = false;

function fluashCallbacks() {
  callbacks.forEach((callback) => callback());
  callbacks = [];
  waiting = false;
}

function timer(fluashCallbacks) {
  let timerFn = () => {};
  if (Promise) {
    timerFn = () => Promise.resolve().then(fluashCallbacks);
  } else if (MutationObserver) {
    const textNode = document.createTextNode(1);
    const observer = new MutationObserver(fluashCallbacks);
    observer.observe(textNode, {
      characterData: true,
    });
    timerFn = () => {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFn = () => setImmediate(fluashCallbacks);
  } else {
    timerFn = () => setTimeout(fluashCallbacks);
  }
  timerFn();
}

function nextTick(callback) {
  callbacks.push(callback);

  if (!waiting) {
    timer(fluashCallbacks);
    waiting = true;
  }
}

const lifecycleHooks = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestory",
  "destoryed",
];

const strats = {};

strats.components = function (parentVal, childVal) {
  const options = Object.create(parentVal);

  if (childVal) {
    for (let key in childVal) {
      options[key] = childVal[key];
    }
  }

  return options;
};

lifecycleHooks.forEach((hook) => {
  strats[hook] = mergeHook;
});

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

function mergeOptions(parent, child) {
  const options = {};

  for (let key in parent) {
    mergeFiled(key);
  }

  for (let key in child) {
    if (parent.hasOwnProperty(key)) {
      continue;
    }
    mergeFiled(key);
  }

  function mergeFiled(key) {
    const parentVal = parent[key];
    const childVal = child[key];

    if (strats[key]) {
      options[key] = strats[key](parentVal, childVal);
    } else {
      if (isObject(parentVal) && isObject(childVal)) {
        options[key] = { ...parentVal, ...childVal };
      } else {
        options[key] = childVal || parentVal;
      }
    }
  }

  return options;
}
