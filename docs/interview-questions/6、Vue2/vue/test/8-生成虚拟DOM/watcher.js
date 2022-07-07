let watcherId = 0;
class Watcher {
  constructor(vm, getter) {
    this.id = watcherId++;
    this.vm = vm;
    this.getter = getter;

    this.deps = [];
    this.depIds = new Set();

    this.get();
  }
  get() {
    pushTarget(this);
    this.getter();
    popTarget();
  }

  update() {
    this.get();
  }

  addDep(dep) {
    let id = dep.id;
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
}
