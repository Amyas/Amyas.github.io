import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./scheduler"

let id = 0

export default class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.user = !!options.user // 是不是用户watcher
    this.callback = callback
    this.options = options
    this.id = id++

    
    if(typeof exprOrFn === 'string') {
      this.getter = function(){
        let path = exprOrFn.split('.')
        let obj = vm
        for(let i = 0;i < path.length; i++) {
          obj = obj[path[i]]
        }

        return obj
      }
    } else {
      this.getter = exprOrFn
    }

    this.deps = []
    this.depsId = new Set()

    this.value = this.get() // 默认初始化取值
  }

  get(){
    pushTarget(this)
    const value = this.getter()
    popTarget()

    return value
  }

  update(){
    queueWatcher(this) // 多次调用update，先缓存watcher，一会一起更新
  }

  run(){
    let newValue = this.get()
    let oldValue = this.value

    this.value = newValue

    if(this.user) {
      this.callback.call(this.vm, newValue, oldValue)
    }
  }

  addDep(dep) {
    let id = dep.id
    if(!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
}