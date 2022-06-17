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
    this.lazy = !!options.lazy // 是否非立即执行
    this.dirty = options.lazy // 如果是计算属性默认为脏属性 lazy = true
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

    this.value =  this.lazy ? undefined : this.get() // 默认初始化取值
  }

  get(){
    pushTarget(this)
    const value = this.getter.call(this.vm)
    popTarget()

    return value
  }

  update(){
    if(this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this) // 多次调用update，先缓存watcher，一会一起更新
    }
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

  evalute(){
    this.dirty = false // 表示取过值了
    this.value = this.get() // 用户getter实行
  }

  depend(){
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend() // 计算属性内的data 属性 收集渲染watcher
    }
  }
}