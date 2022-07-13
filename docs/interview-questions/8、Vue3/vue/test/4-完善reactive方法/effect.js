let activeEffect = undefined;
const targetMap = new WeakMap();

class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.parent = null;
    this.deps = [];
    this.active = true;
  }
  run() {
    if (!this.active) {
      return this.fn();
    } else {
      try {
        this.parent = activeEffect;
        activeEffect = this;
        cleanEffect(this);
        return this.fn();
      } finally {
        activeEffect = this.parent;
        this.parent = null;
      }
    }
  }
  stop() {
    if (this.active) {
      this.active = false;
      cleanEffect(this);
    }
  }
}

function cleanEffect(effect) {
  const deps = effect.deps;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect);
  }
  effect.deps.length = 0;
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
    activeEffect.deps.push(deps);
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  let effects = depsMap.get(key);
  if (effects) {
    effects = new Set(effects);
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        effect.run();
      }
    });
  }
}

function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  const runner = _effect.run.bind(_effect);
  _effect.run();
  runner.effect = _effect;
  return runner;
}
