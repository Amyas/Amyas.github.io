import { popTarget, pushTarget } from "./dep"

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