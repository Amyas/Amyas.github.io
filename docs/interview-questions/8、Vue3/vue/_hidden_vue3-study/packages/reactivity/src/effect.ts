export let activeEffect = undefined;

function cleanEffect(effect) {
  // 需要清理effect中存入属性set的effect
  let deps = effect.deps;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect);
  }
  effect.deps.length = 0;
}

// 依赖收集的原理是借助js单线程，默认调用effect时候去调用proxy的get
// 让属性记住依赖的effect，同理让effect记住对应的属性
// 靠的是数据结果weak map {map:{key: new Set()}}
// 稍后数据变化的时候，找到对应的map，通过属性发出set中effect
export class ReactiveEffect {
  public active = true;
  public parent = null;
  public deps = []; // effect中用了哪些属性，后续清理的时候使用
  constructor(public fn, public scheduler?) {
    // public fn === this.fn = fn
  }
  run() {
    // 去proxy对象上取值，
    // 取值的时候，让这个属性和当前的effect函数关联起来
    // 稍后数据变化后，可以重新执行effect函数
    // 以来收集，让属性和effect关联起来
    if (!this.active) {
      return this.fn();
    } else {
      try {
        this.parent = activeEffect;
        activeEffect = this;
        cleanEffect(this);
        return this.fn();
      } finally {
        // 取消当前正在运行的effect
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

const targetMap = new WeakMap();

export function trigger(target, key, value) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return; // 属性没有依赖任何effect
  }

  let effects = depsMap.get(key);
  triggerEffects(effects);
}

export function triggerEffects(effects) {
  if (effects) {
    effects = new Set(effects);
    effects.forEach((effect) => {
      // 该判断解决effect内修改state数据，造成无限执行，栈溢出
      // 保证执行的effect不是当前的activeEffect
      if (effect !== activeEffect) {
        if (effect.scheduler) {
          effect.scheduler(); // 用户提供函数走用户的
        } else {
          effect.run(); // 重新执行effect
        }
      }
    });
  }
}

// 哪个对象中的哪个属性，对应哪个effect，一个属性可以对应多个effect
// 外层用一个map{object:{name:[effect],age:[effect, effect]}}
export function track(target, key) {
  // 让属性记录所用到的effect是谁
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }

    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }

    trackEffects(deps);
  }
}

export function trackEffects(deps) {
  let shouldTrack = !deps.has(activeEffect);
  if (shouldTrack) {
    deps.add(activeEffect);
    activeEffect.deps.push(deps);
  }
}

export function effect(fn, options = {} as any) {
  // 将用户传递的函数变成响应式的effect
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  // 更改runner中的this
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect; // 暴露effect实例

  return runner;
}
