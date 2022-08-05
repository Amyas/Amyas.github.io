class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
  }
  run() {
    this.fn();
  }
}

function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
