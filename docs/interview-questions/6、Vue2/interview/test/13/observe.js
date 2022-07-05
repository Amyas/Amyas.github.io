function observe(data) {
  if (!isObject(data)) return;

  if (data.__ob__) return data.__ob__;

  return new Observer(data);
}

function isObject(val) {
  return typeof val === "object" && val !== null;
}

const oldArrayprototype = Array.prototype;
const arrayMethods = Object.create(Array.prototype);
const methods = [
  "push",
  "pop",
  "unshift",
  "shift",
  "reverse",
  "splice",
  "sort",
];

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    oldArrayprototype[method].call(this, ...args);

    let inserted;
    const ob = this.__ob__;

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

    ob.dep.notify();
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

function dependArray(val) {
  val.forEach((current) => {
    current.__ob__ && current.__ob__.dep.depend();
    if (Array.isArray(current)) {
      dependArray(current);
    }
  });
}

function defineReactive(data, key, val) {
  const childOb = observe(val);
  const dep = new Dep();

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
