function Vue(options) {
  const vm = this
  vm.$options = options

  initData(vm)

  new Watcher(vm, ()=>{
    console.log(vm._data.arr, '@@@ update')
  })

  if(vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}

Vue.prototype.$mount = function(el){
  const vm = this
  const options = vm.$options

  el = document.querySelector(el)

  let template = options.template
  if(!template && el) {
    template = el.outerHTML
  }
  options.render = compileToFunction(template)
}

function initData(vm) {
  let data = vm.$options.data

  data = vm._data = isFunction(data) ? data.call(vm) : data

  observe(data)
}

function isFunction(data){
  return typeof data === 'function'
}