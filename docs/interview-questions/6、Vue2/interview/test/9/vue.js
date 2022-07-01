function Vue(options) {
  const vm = this;
  vm.$options = options;

  initData(vm);

  new Watcher(vm, () => {
    // console.log(vm._data.arr, "@@@update");
  });

  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}

Vue.prototype.$mount = function (el) {
  const vm = this;
  const options = vm.$options;

  el = document.querySelector(el);

  let template = options.template;
  if (!template && el) {
    template = el.outerHTML;
  }
  options.render = compileToFunction(template);

  mountComponent(vm);
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

Vue.prototype._render = function () {
  const vm = this;
  const options = vm.$options;

  let vnode = options.render.call(vm);

  return vnode;
};
Vue.prototype._update = function (vnode) {
  console.log("@@@update", vnode);
};

function mountComponent(vm) {
  const updateComponent = () => {
    vm._update(vm._render());
  };
  updateComponent();
}

function initData(vm) {
  let data = vm.$options.data;

  data = vm._data = isFunction(data) ? data.call(vm) : data;

  for (let key in data) {
    proxy(vm, "_data", key);
  }

  observe(data);
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

function isFunction(val) {
  return typeof val === "function";
}
