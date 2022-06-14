import {isFunction} from './utils'
import {observe} from './observer/index'
import Watcher from './observer/watcher'

export function stateMixin(Vue) {
  Vue.prototype.$watch = function(key, handler, options = {}) {
    options.user = true // 用户自己写的watcher
    new Watcher(this, key, handler,options)
  }
}

export function initState(vm) {
  const opts = vm.$options
  if(opts.data) {
    initData(vm)
  }
  if(opts.watch) {
    initWatch(vm, opts.watch)
  }
}

function initWatch(vm, watch) {
  for(let key in watch) {
    let handler = watch[key]
    if(Array.isArray(handler)) { // 多个函数
      for(let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else { // 单个函数
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(vm, key, handler){
  return vm.$watch(key, handler)
}

function initData(vm) {
  let data = vm.$options.data

  data = vm._data = isFunction(data) ? data.call(vm) : data

  for(let key in data) {
    proxy(vm,'_data',key)
  }

  observe(data)
}

function proxy(vm,source,key) {
  Object.defineProperty(vm,key,{
    get(){
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}