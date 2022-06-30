function observe(data) {
  if (!isObject(data)) return;

  return new Observer(data);
}

function isObject(val) {
  return typeof val === "object" && val !== null;
}

let oldArrayPrototype = Array.prototype;
let arrayMethods = Object.create(Array.prototype);
let methods = ["push", "pop", "unshift", "shift", "reverse", "sort", "splice"];

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
    this.dep = new Dep()
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false,
    });

    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  observeArray(data) {
    data.forEach((item) => observe(item));
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

function dependArray(value) {
  for(let i = 0; i < value.length; i++) {
    let current = value[i]
    current.__ob__ && current.__ob__.dep.depend()
    if(Array.isArray(current)) {
      dependArray(current)
    }
  }
}

function defineReactive(data, key, value) {
  let childOb = observe(value);
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if(Dep.target) {
        dep.depend()
        if(childOb) {
          childOb.dep.depend()
          if(Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      observe(newValue);
      value = newValue;

      dep.notify()
    },
  });
}
