import {isObject} from '../utils'
import {arrayMethods} from './array'
import Dep from './dep'

export function observe(data) {
  if(!isObject(data)) return

  if(data.__ob__) return data.__ob__

  return new Observer(data)
}

class Observer {
  constructor(data) {
    this.dep = new Dep()

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

function dependArray(value) {
  for(let i = 0; i < value.length; i++) {
    let current = value[i]
    current.__ob__ && current.__ob__.dep.depend()
    if(Array.isArray(current)) {
      dependArray(current)
    }
  }
}


function defineProperty(data,key,value) {
  let childOb = observe(value)
  let dep = new Dep()
  Object.defineProperty(data,key,{
    get(){
      if(Dep.target) {
        dep.depend()
        if(childOb) {
          childOb.dep.depend()
          if(Array.isArray(value)) {
            dependArray(value)
          }
        }
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