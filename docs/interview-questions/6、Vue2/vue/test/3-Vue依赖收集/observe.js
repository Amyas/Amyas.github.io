function isObject(val) {
  return typeof val === "object" && val !== null;
}

function observe(data) {
  if (!isObject(data)) return;

  new Observer(data);
}

let oldArrayPrototype = Array.prototype;
let arrayMethods = Object.create(Array.prototype);
let methods = ["push", "unshift", "pop", "shift", "reverse", "sort", "splice"];

arrayMethods.forEach((method) => {
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
  };
});

class Observer {
  constructor(data) {
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

function defineReactive(data, key, value) {
  observe(value);
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if(Dep.target) {
        dep.depend()
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
