import { compileToFunction } from './compiler/index'
import {initState} from './state'
import { mountComponent } from './lifecycle'
import { mergeOptions } from './utils'

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options, options)

    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')

    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
    
  }

  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    vm.$el = el

    if(!options.render) {
      let template = options.template
      if(!template && el) {
        template = el.outerHTML
        let render = compileToFunction(template)
        options.render = render
      }
    }
    
    mountComponent(vm, el) // 组建挂在
  }
}

export function callHook(vm, hook){
  const handlers = vm.$options[hook]
  if(handlers) {
    for(let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}