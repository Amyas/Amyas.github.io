function computed(getterOrOptions) {
  const isGetter = isFunction(getterOrOptions);

  let getter;
  let setter;

  const fn = () => console.warn("computed is readonly");
  if (isGetter) {
    getter = getterOrOptions;
    setter = fn;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set || fn;
  }

  return new ComputedRefImpl(getter, setter);
}

class ComputedRefImpl {
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = setter;
    this._value = null;
    this._dirty = true;
    this.deps = null;
    this.__v_isRef = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }

      triggerEffects(this.deps);
    });
  }
  get value() {
    if (activeEffect) {
      trackEffects(this.deps || (this.deps = new Set()));
    }
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
  }
  set value(newValue) {
    this.setter(newValue);
  }
}
