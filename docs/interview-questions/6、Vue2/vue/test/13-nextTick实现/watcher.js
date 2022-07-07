let watcherId = 0;

let has = {};
let queue = [];
let pending = false;

function fluashSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run();
  }
  queue = [];
  has = {};
  pending = false;
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    has[id] = true;
    queue.push(watcher);

    if (!pending) {
      nextTick(fluashSchedulerQueue);
      pending = true;
    }
  }
}

class Watcher {
  constructor(vm, expOrFn) {
    this.id = watcherId++;
    this.vm = vm;
    this.getter = expOrFn;

    this.depIds = new Set();
    this.deps = [];

    this.get();
  }
  get() {
    pushTarget(this);
    this.getter();
    popTarget();
  }
  update() {
    queueWatcher(this);
  }
  run() {
    this.get();
  }
  addDep(dep) {
    const id = dep.id;
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
}
