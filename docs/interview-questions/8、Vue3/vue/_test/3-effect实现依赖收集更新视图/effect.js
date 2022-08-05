let activeEffect = undefined;
const targetMap = new WeakMap();

class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.parent = null;
  }
  run() {
    try {
      this.parent = activeEffect;
      activeEffect = this;
      this.fn();
    } finally {
      activeEffect = this.parent;
      this.parent = null;
    }
  }
}

function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  let shouldTrack = !deps.has(activeEffect);
  if (shouldTrack) {
    deps.add(activeEffect);
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const effects = depsMap.get(key);
  if (effects) {
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        effect.run();
      }
    });
  }
}

function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
