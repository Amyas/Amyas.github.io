import {isObject} from '../utils'
import {arrayMethods} from './array'
import Dep from './dep'

export function observe(data) {
  if(!isObject(data)) return

  if(data.__ob__) return

  return new Observer(data)
}

class Observer {
  constructor(data) {
    Object.defineProperty(data,'__ob__',{
      value: this,
      enumerable: false
    })
    if(Array.isArray(data)) {
      data._proto_ = arrayMethods
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  observeArray(data) {
    data.forEach(item=>observe(item))
  }
  walk(data) {
    Object.keys(data).forEach(key=>{
      defineProperty(data,key,data[key])
    })
  }
}

function defineProperty(data,key,value) {
  observe(value)
  let dep = new Dep()
  Object.defineProperty(data,key,{
    get(){
      if(Dep.target) {
        dep.depend()
      }
      return value
    },
    set(newValue) {
      if(newValue !== value) {
        observe(newValue)
        value = newValue
        dep.notify()
      }
    }
  })
}