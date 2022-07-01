function observe(data) {
  if (!isObject(data)) return;

  if (data.__ob__) return data.__ob__;

  return new Observer(data);
}

function isObject(val) {
  return typeof val === "object" && val !== null;
}

let oldArrayPrototype = Array.prototype;
let arrayMethods = Object.create(Array.prototype);
let methods = ["push", "pop", "unshift", "shift", "reverse", "splice", "sort"];
methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    oldArrayPrototype[method].call(this, ...args);

    let inserted;
    let ob = this.__ob__;

    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
      default:
        break;
    }

    if (inserted) {
      ob.observeArray(inserted);
    }

    ob.dep.notify()
  };
});

class Observer {
  constructor(data) {
    this.dep = new Dep();
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false,
    });
    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods;
      this.observeArray(data);
    }
    this.walk(data);
  }

  observeArray(data) {
    data.forEach((i) => observe(i));
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

function dependArray(val) {
  val.forEach((cur) => {
    cur.__ob__ && cur.__ob__.dep.depend();
    if (Array.isArray(cur)) {
      dependArray(cur);
    }
  });
}

function defineReactive(data, key, val) {
  let childOb = observe(val);
  let dep = new Dep();

  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(val)) {
            dependArray(val);
          }
        }
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      observe(newVal);
      val = newVal;
      dep.notify();
    },
  });
}
