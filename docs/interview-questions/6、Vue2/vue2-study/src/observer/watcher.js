import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./scheduler"

let id = 0

export default class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.callback = callback
    this.options = options
    this.id = id++

    this.getter = exprOrFn

    this.deps = []
    this.depsId = new Set()

    this.get() // 默认初始化取值
  }

  get(){
    pushTarget(this)
    this.getter()
    popTarget()
  }

  update(){
    queueWatcher(this) // 多次调用update，先缓存watcher，一会一起更新
  }

  run(){
    this.get()
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