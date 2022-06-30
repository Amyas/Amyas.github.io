function Vue(options) {
  this.$options = options;

  initData(this);

  new Watcher(this, ()=>{
    updateComponent(this)
  })
}
function updateComponent(vm){
  // 首次打印：模拟渲染模版，出发 Dep.target赋值
  console.log(vm._data.name, 'updateComponent')
}
function isFunction(val) {
  return typeof val === "function";
}
function initData(vm) {
  let data = vm.$options.data;

  data = vm._data = isFunction(data) ? data.call(vm) : data;

  observe(data);
}
