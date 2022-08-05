function Vue(options) {
  const vm = this;
  vm.$options = options;

  initData(vm);

  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}

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
