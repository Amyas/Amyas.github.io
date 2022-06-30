let watcherId = 0

class Watcher {
  constructor(vm, expOrFn, options) {
    this.vm = vm
    this.getter = expOrFn
    this.options = options

    this.depIds = new Set()
    this.deps = []

    this.get()
  }

  get(){
    pushTarget(this)
    this.getter()
    popTarget()
  }

  update(){
    this.getter()
  }

  addDep(dep) {
    let id = dep.id
    if(!this.depIds.has(id)) {
      this.depIds.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
}