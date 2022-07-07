let depId = 0;
const stack = []
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
    this.subs.forEach((watcher) => watcher.update());
  }
}

Dep.target = null;

function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher);
}

function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}
