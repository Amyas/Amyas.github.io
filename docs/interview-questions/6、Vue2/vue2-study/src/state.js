import {isFunction} from './utils'
import {observe} from './observer/index'

export function initState(vm) {
  const opts = vm.$options
  if(opts.data) {
    initData(vm)
  }
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