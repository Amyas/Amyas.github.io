function Vue(options) {
  this.$options = options
  const vm = this

  initData(vm)

  new Watcher(vm, ()=>{
    // console.log(vm._data.arr, 'update-component')
  })

  if(vm.$options.el) {
    this.$mount(vm.$options.el)
  }
}
Vue.prototype.$mount = function(el) {
  const vm = this
  const options = vm.$options
  
  el = document.querySelector(el)

  let template = vm.$options.template
  if(!template && el) {
    template = el.outerHTML
  }
  let render = compileToFunction(template)
  options.render =  render
}

function initData(vm) {
  let data = vm.$options.data

  data = vm._data = isFunction(data) ? data.call(vm) : data

  observe(data)
}

function isFunction(val) {
  return typeof val === 'function'
}