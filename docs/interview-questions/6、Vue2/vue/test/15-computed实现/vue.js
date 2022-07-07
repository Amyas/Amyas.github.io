function Vue(options) {
  const vm = this;
  vm.$options = options;

  if (options.data) {
    initData(vm);
  }

  if (options.watch) {
    initWatch(vm, options.watch);
  }

  if (options.computed) {
    initComputed(vm, options.computed);
  }

  if (options.el) {
    vm.$mount(options.el);
  }
}

function initComputed(vm, computed) {
  const watchers = (vm._computedWatchers = {});
  for (let key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true });
    defineComputed(vm, key, userDef);
  }
}

let shareProperty = {};
function defineComputed(vm, key, userDef) {
  if (typeof userDef === "function") {
    shareProperty.get = createComputedGetter(key);
  } else {
    shareProperty.get = createComputedGetter(key);
    shareProperty.set = userDef.set;
  }
  Object.defineProperty(vm, key, shareProperty);
}

function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key];

    if (watcher.dirty) {
      watcher.evalute();
    }

    if (Dep.target) {
      watcher.depend();
    }

    return watcher.value;
  };
}

function initWatch(vm, watch) {
  for (let key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, key, handler) {
  return vm.$watch(key, handler);
}

Vue.prototype.$watch = function (key, handler, options = {}) {
  options.user = true;
  new Watcher(this, key, handler, options);
};

Vue.prototype.$nextTick = nextTick;

Vue.prototype.$mount = function (el) {
  const vm = this;
  const options = vm.$options;

  el = document.querySelector(el);
  vm.$el = el;

  let template = options.template;
  if (!template && el) {
    template = el.outerHTML;
  }
  options.render = compileToFunction(template);

  mountComponent(vm);
};

function mountComponent(vm) {
  const updateComponent = () => {
    vm._update(vm._render());
  };

  new Watcher(vm, updateComponent);
}

Vue.prototype._render = function () {
  const vm = this;
  const options = vm.$options;

  const vnode = options.render.call(vm);
  return vnode;
};

Vue.prototype._c = function () {
  return createElement(this, ...arguments);
};

Vue.prototype._v = function (text) {
  return createTextElement(this, text);
};

Vue.prototype._s = function (val) {
  if (typeof val === "object") {
    return JSON.stringify(val);
  }
  return val;
};

Vue.prototype._update = function (vnode) {
  const vm = this;
  const prevVnode = vm._vnode;

  if (!prevVnode) {
    vm.$el = patch(vm.$el, vnode);
  } else {
    vm.$el = patch(prevVnode, vnode);
  }

  vm._vnode = vnode;
};

function initData(vm) {
  let data = vm.$options.data;

  data = vm._data = isFunction(data) ? data.call(vm) : data;

  for (let key in data) {
    proxy(vm, "_data", key);
  }

  observe(data);
}

function isFunction(val) {
  return typeof val === "function";
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    },
  });
}
