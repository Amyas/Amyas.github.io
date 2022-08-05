import {isFunction} from './utils'
import {observe} from './observer/index'
import Watcher from './observer/watcher'
import Dep from './observer/dep'

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
  if(opts.computed) {
    initComputed(vm, opts.computed)
  }
  if(opts.watch) {
    initWatch(vm, opts.watch)
  }
}

function initComputed(vm, computed){
  const watchers = vm._computedWatchers = {}
  for(let key in computed) {
    const userDef = computed[key]
    let getter = typeof userDef === 'function' ? userDef : userDef.get

    watchers[key] = new Watcher(vm, getter, ()=>{},{lazy: true}) // 默认不执行

    // 将key定义到vm上
    defineComputed(vm, key, userDef)
  }
}

function createComputedGetter(key) {
  return function computedGetter(){
    // 包含所有计算属性，通过keyu拿到对应watcher
    let watcher = this._computedWatchers[key]

    // 脏就是要调用用户的getter，不脏就走缓存
    if(watcher.dirty) {
      watcher.evalute()
    }

    // 如果去完值后Dep.target还有值，继续向上收集（渲染watcher）
    if(Dep.target) {
      watcher.depend()
    }

    return watcher.value
  }
}

let shareProperty = {}
function defineComputed(vm, key, userDef) {
  if(typeof userDef === 'function') {
    shareProperty.get = createComputedGetter(key)
  } else {
    shareProperty.get = createComputedGetter(key)
    shareProperty.set = userDef.set
  }
  Object.defineProperty(vm, key, shareProperty)
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