import {isObject} from '../utils'

export function observe(data) {
  if(!isObject(data)) return

  return new Observer(data)
}

class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    Object.keys(data).forEach(key=>{
      defineProperty(data,key,data[key])
    })
  }
}

function defineProperty(data,key,value) {
  observe(value)
  Object.defineProperty(data,key,{
    get(){
      return value
    },
    set(newValue) {
      observe(newValue)
      value = newValue
    }
  })
}