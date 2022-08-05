function Vue(options) {
  this.$options = options;

  initData(this);

  new Watcher(this, () => updateComponent(this));
}

function initData(vm) {
  let data = vm.$options.data

  data = vm._data = isFunction(data) ? data.call(vm) : data

  observe(data)
}

function isFunction(val) {
  return typeof val === 'function'
}

function updateComponent(vm) {
  console.log(vm._data.arr, 'update-component')
}