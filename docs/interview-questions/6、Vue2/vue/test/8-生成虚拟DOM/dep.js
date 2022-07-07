let depId = 0;
class Dep {
  constructor() {
    this.id = depId++;
    this.subs = [];
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((v) => v.update());
  }
}

Dep.target = null;
function pushTarget(watcher) {
  Dep.target = watcher;
}
function popTarget() {
  Dep.target = null;
}
