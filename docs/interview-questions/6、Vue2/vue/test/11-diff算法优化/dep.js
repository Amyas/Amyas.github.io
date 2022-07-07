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
  addSub(w) {
    this.subs.push(w)
  }
  notify() {
    this.subs.forEach((v) => v.update());
  }
}

Dep.target = null;

function pushTarget(w) {
  Dep.target = w;
}

function popTarget() {
  Dep.target = null;
}
