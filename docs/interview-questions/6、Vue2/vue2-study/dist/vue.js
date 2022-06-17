(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function isFunction(value) {
    return typeof value === 'function';
  }
  function isObject(value) {
    return _typeof(value) === 'object' && typeof value !== null;
  }
  var callbacks = [];

  function fluashCallbacks() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    waiting = false;
  }

  function timer(fluashCallbacks) {
    var timerFn = function timerFn() {};

    if (Promise) {
      timerFn = function timerFn() {
        return Promise.resolve().then(fluashCallbacks);
      };
    } else if (MutationObserver) {
      var textNode = document.createTextNode(1);
      var observe = new MutationObserver(fluashCallbacks);
      observe.observe(textNode, {
        characterData: true
      });

      timerFn = function timerFn() {
        textNode.textContent = 3;
      };
    } else if (setImmediate) {
      timerFn = function timerFn() {
        setImmediate(fluashCallbacks);
      };
    } else {
      timerFn = function timerFn() {
        setTimeout(fluashCallbacks);
      };
    }

    timerFn();
  }

  var waiting = false;
  function nextTick(callback) {
    callbacks.push(callback);

    if (!waiting) {
      timer(fluashCallbacks);
      waiting = true;
    }
  }
  var lifecycleHooks = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {}; // 存放各种合并策略

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  lifecycleHooks.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  strats.components = function (parentVal, childVal) {
    var options = Object.create(parentVal);

    if (childVal) {
      for (var key in childVal) {
        options[key] = childVal[key];
      }
    }

    return options;
  };

  function mergeOptions(parent, child) {
    var options = {}; // 合并后的结果

    for (var key in parent) {
      mergeFiled(key);
    }

    for (var _key in child) {
      if (parent.hasOwnProperty(_key)) {
        continue;
      }

      mergeFiled(_key);
    }

    function mergeFiled(key) {
      var parentVal = parent[key];
      var childVal = child[key]; // 策略模式

      if (strats[key]) {
        options[key] = strats[key](parentVal, childVal);
      } else {
        if (isObject(parentVal) && isObject(childVal)) {
          options[key] = _objectSpread2(_objectSpread2({}, parentVal), childVal);
        } else {
          options[key] = childVal || parentVal;
        }
      }
    }

    return options;
  }
  function isReservedTag(str) {
    var reservedTag = "a,div,span,p,img,button,ul,li,h1";
    return reservedTag.includes(str);
  }

  function initGlobalApi(Vue) {
    Vue.options = {}; // 用来存放全局配置 // Vue.component Vue.filter Vue.directive 每个组件初始化时都会和options选项进行合并

    Vue.mixin = function (options) {
      this.options = mergeOptions(this.options, options);
      return this;
    };

    Vue.options._base = Vue; // 无论后续创建多少个子类，都可以通过_base找到Vue

    Vue.options.components = {};

    Vue.component = function (id, definition) {
      // 保证组件的隔离，保证每个组件都会产生一个新的类，去继承父类
      definition = this.options._base.extend(definition);
      this.options.components[id] = definition;
    };

    Vue.extend = function (options) {
      // 产生一个继承Vue的类，
      // 拥有父类所有功能
      var Super = this;

      var Sub = function VueComponent(options) {
        this._init(options);
      }; // 原型继承


      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(Super.options, options); // 只和Vue.options合并

      return Sub;
    };
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 用来获取的标签名

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配开始标签

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配闭合标签

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/;
  var root = null;
  var stack$1 = [];

  function createAstElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      // 元素：1，文本：3
      children: [],
      parent: null,
      attrs: attrs
    };
  }

  function start(tagName, attributes) {
    var parent = stack$1[stack$1.length - 1];
    var element = createAstElement(tagName, attributes);

    if (!root) {
      root = element;
    }

    if (parent) {
      element.parent = parent;
      parent.children.push(element);
    }

    stack$1.push(element);
  }

  function end(tagName) {
    var last = stack$1.pop();

    if (last.tag !== tagName) {
      throw new Error("标签闭合错误");
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, "");
    var parent = stack$1[stack$1.length - 1];

    if (text) {
      parent.children.push({
        type: 3,
        // 元素：1，文本：3
        text: text
      });
    }
  }

  function parseHTML(html) {
    root = null;
    stack$1 = [];

    function advance(len) {
      html = html.substring(len);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 删除已经匹配的开始标签

        var _end;

        var attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 没有遇到标签结尾
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (_end) {
          advance(_end[0].length);
        }

        return match;
      }

      return false; // 不是开始标签
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var startTagMatch = parseStartTag(); // 解析开始标签

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag); // 解析结束标签

        if (endTagMatch) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        chars(text);
        advance(text.length);
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var styleObj = {};
          attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
            styleObj[arguments[1]] = arguments[2];
          });
          attr.value = styleObj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(el) {
    if (el.type === 1) {
      return generate(el);
    } else {
      var text = el.text;

      if (!defaultTagRE.test(text)) {
        return "_v(\"".concat(text, "\")");
      } else {
        var tokens = [];
        var match;
        var lastIndex = defaultTagRE.lastIndex = 0; // defaultTagRE 最后的/g后和exec冲突，导致第一次exec正常，第二次失效

        while (match = defaultTagRE.exec(text)) {
          var index = match.index;

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")")); // _s JSON.stringify()

          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function genChildren(el) {
    var children = el.children;

    if (children) {
      return children.map(function (c) {
        return gen(c);
      }).join(',');
    }

    return false;
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\", ").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : "", ")");
    return code;
  }

  function compileToFunction(template) {
    var root = parseHTML(template);
    var code = generate(root);
    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
  }

  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(Array.prototype);
  var methods = ['push', 'pop', 'unshift', 'shift', 'reverse', 'splice', 'sort'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayMethods$meth;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_oldArrayMethods$meth = oldArrayMethods[method]).call.apply(_oldArrayMethods$meth, [this].concat(args));

      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        ob.observeArray(inserted);
      }

      ob.dep.notify();
    };
  });

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = []; // 用来存放watcher
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        if (Dep.target) {
          Dep.target.addDep(this);
        }
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();
  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  function observe(data) {
    if (!isObject(data)) return;
    if (data.__ob__) return data.__ob__;
    return new Observer(data);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      this.dep = new Dep();
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      });

      if (Array.isArray(data)) {
        data._proto_ = arrayMethods;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineProperty(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineProperty(data, key, value) {
    var childOb = observe(value);
    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();

          if (childOb) {
            childOb.dep.depend();

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue !== value) {
          observe(newValue);
          value = newValue;
          dep.notify();
        }
      }
    });
  }

  var queue = [];
  var has = {};
  var pending = false;

  function fluashSchedulerQueue() {
    for (var i = 0; i < queue.length; i++) {
      queue[i].run();
    }

    queue = [];
    has = {};
    pending = false;
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] === null || has[id] === undefined) {
      queue.push(watcher);
      has[id] = true;

      if (!pending) {
        nextTick(fluashSchedulerQueue);
        pending = true;
      }
    }
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.user = !!options.user; // 是不是用户watcher

      this.callback = callback;
      this.options = options;
      this.lazy = !!options.lazy; // 是否非立即执行

      this.dirty = options.lazy; // 如果是计算属性默认为脏属性 lazy = true

      this.id = id++;

      if (typeof exprOrFn === 'string') {
        this.getter = function () {
          var path = exprOrFn.split('.');
          var obj = vm;

          for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
          }

          return obj;
        };
      } else {
        this.getter = exprOrFn;
      }

      this.deps = [];
      this.depsId = new Set();
      this.value = this.lazy ? undefined : this.get(); // 默认初始化取值
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this);
        var value = this.getter.call(this.vm);
        popTarget();
        return value;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this); // 多次调用update，先缓存watcher，一会一起更新
        }
      }
    }, {
      key: "run",
      value: function run() {
        var newValue = this.get();
        var oldValue = this.value;
        this.value = newValue;

        if (this.user) {
          this.callback.call(this.vm, newValue, oldValue);
        }
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "evalute",
      value: function evalute() {
        this.dirty = false; // 表示取过值了

        this.value = this.get(); // 用户getter实行
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend(); // 计算属性内的data 属性 收集渲染watcher
        }
      }
    }]);

    return Watcher;
  }();

  function stateMixin(Vue) {
    Vue.prototype.$watch = function (key, handler) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      options.user = true; // 用户自己写的watcher

      new Watcher(this, key, handler, options);
    };
  }
  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed(vm, opts.computed);
    }

    if (opts.watch) {
      initWatch(vm, opts.watch);
    }
  }

  function initComputed(vm, computed) {
    var watchers = vm._computedWatchers = {};

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      watchers[key] = new Watcher(vm, getter, function () {}, {
        lazy: true
      }); // 默认不执行
      // 将key定义到vm上

      defineComputed(vm, key, userDef);
    }
  }

  function createComputedGetter(key) {
    return function computedGetter() {
      // 包含所有计算属性，通过keyu拿到对应watcher
      var watcher = this._computedWatchers[key]; // 脏就是要调用用户的getter，不脏就走缓存

      if (watcher.dirty) {
        watcher.evalute();
      } // 如果去完值后Dep.target还有值，继续向上收集（渲染watcher）


      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    };
  }

  var shareProperty = {};

  function defineComputed(vm, key, userDef) {
    if (typeof userDef === 'function') {
      shareProperty.get = createComputedGetter(key);
    } else {
      shareProperty.get = createComputedGetter(key);
      shareProperty.set = userDef.set;
    }

    Object.defineProperty(vm, key, shareProperty);
  }

  function initWatch(vm, watch) {
    for (var key in watch) {
      var handler = watch[key];

      if (Array.isArray(handler)) {
        // 多个函数
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        // 单个函数
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher(vm, key, handler) {
    return vm.$watch(key, handler);
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = isFunction(data) ? data.call(vm) : data;

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  function patch(oldVnode, vnode) {
    if (!oldVnode) {
      return createElm(vnode); // 如果没有el，就是组件，直接根据虚拟节点返回真实节点
    }

    if (oldVnode.nodeType === 1) {
      // 真是元素，第一次更新
      // 用vnode来生成真实dom替换原来的dom元素
      var parentEl = oldVnode.parentNode;
      var elm = createElm(vnode); // 根据虚拟节点创建元素

      parentEl.insertBefore(elm, oldVnode.nextSibling);
      parentEl.removeChild(oldVnode);
      return elm;
    } else {
      // 如果标签名称不一样，直接删除老的换成新的即可
      if (oldVnode.tag !== vnode.tag) {
        // 可以通过vnode.el获取真实dom
        return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
      } // 如果标签一样，比较属性，传入新的虚拟节点和老的属性，用新的属性更新老的
      // 标签相同，直接复用之前的node节点，不需要重新创建 


      var el = vnode.el = oldVnode.el; // 如果两个虚拟节点是文本节点，比较文本内容

      if (vnode.tag === undefined) {
        // 新老都是文本
        if (oldVnode.text !== vnode.text) {
          el.textContent = vnode.text;
        } // 都是文本，就不需要对下面的内容了


        return;
      } // 根据新传入的props，进行props修改


      patchProps(vnode, oldVnode.data);
      var oldChildren = oldVnode.children || [];
      var newChildren = vnode.children || [];

      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 双方都有儿子
        // vue使用双指针处理
        patchChildren(el, oldChildren, newChildren);
      } else if (newChildren.length > 0) {
        // 只有新节点有儿子
        for (var i = 0; i < newChildren.length; i++) {
          // 创建出儿子的真实节点，然后拆入进去
          var child = createElm(newChildren[i]);
          el.appendChild(child);
        }
      } else if (oldChildren.length > 0) {
        // 只有老节点有儿子
        // 新节点没儿子，直接清空
        el.innerHTML = '';
      }
    }
  } // 是否为同一个元素

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
  }

  function patchChildren(el, oldChildren, newChildren) {
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[0];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldChildren.length - 1];
    var newStartIndex = 0;
    var newStartVnode = newChildren[0];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newChildren.length - 1];

    var makeIndexByKey = function makeIndexByKey(children) {
      return children.reduce(function (total, current, index) {
        if (current.key) {
          total[current.key] = index;
        }

        return total;
      }, {});
    };

    var keysMap = makeIndexByKey(oldChildren); // 只比对同等数量的节点

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } // 同时循环新的节点和老的节点


      if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 头部开始比较
        patch(oldStartVnode, newStartVnode);
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        // 尾部开始比较
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        // 头尾比较
        patch(oldStartVnode, newEndVnode);
        el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        // 尾头比较
        patch(oldEndVnode, newStartVnode);
        el.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        // 乱序比较 核心diff
        // 1.需要根据key和对应的索引将老的内容生成映射表
        var moveIndex = keysMap[newStartVnode.key]; // 那新的去老的中查找

        if (moveIndex == undefined) {
          // 如果不能复用直接创建新的插入到老的节点开头处
          el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var moveNode = oldChildren[moveIndex];
          oldChildren[moveIndex] = null; // 此节点已经被移动走了 

          el.insertBefore(moveNode.el, oldStartVnode.el);
          patch(moveNode, newStartVnode);
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    } // 如果用户追加了n个节点


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        // el.appendChild(createElm(newChildren[i]))
        // insertBefore 可以直线appendChild功能
        // 看一下尾指针的下一个元素是否存在
        var anchor = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
        el.insertBefore(createElm(newChildren[i]), anchor);
      }
    } // 用户减少了n个节点


    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        // 如果老的多，将老的节点删除，但是可能存在null的情况
        if (oldChildren[_i] !== null) {
          el.removeChild(oldChildren[_i].el);
        }
      }
    }
  } // 初次渲染时可以调用此方法，后续更新也可以调用此方法


  function patchProps(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el; // 如果老的属性有，新的没有直接删除

    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        // 新的元素内不存在
        el.style[key] = '';
      }
    }

    for (var _key in oldProps) {
      if (!newProps[_key]) {
        el.removeAttribute(_key);
      }
    }

    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else {
        vnode.el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function createComponent$1(vnode) {
    var i = vnode.data; // i = vnode.data.hook -> i = vnode.data.hook.init
    // 判断+复值

    if ((i = i.hook) && (i = i.init)) {
      i(vnode); // 调用组件的init方法
    }

    if (vnode.componentInstance) {
      // 说明子组件new 完成了，并且创建了真实dom
      return true;
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag;
        vnode.data;
        var children = vnode.children,
        text = vnode.text;
        vnode.vm;

    if (typeof tag === 'string') {
      // 元素
      if (createComponent$1(vnode)) {
        // 返回组件对应的真实节点
        return vnode.componentInstance.$el;
      }

      vnode.el = document.createElement(tag);
      patchProps(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // 既有初始化又有更新
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };

    Vue.prototype.$nextTick = nextTick;
  }
  function mountComponent(vm, el) {
    // 更新函数，数据变化后，再次调用此函数
    var updateComponent = function updateComponent() {
      // 调用render函数，生成虚拟dom
      vm._update(vm._render()); // 后续更新可以调用updateComponent
      // 用虚拟dom生成真是dom

    };

    callHook(vm, 'beforeMount');
    new Watcher(vm, updateComponent, function () {
      console.log('更新视图了');
    }, true); // 是一个渲染watcher

    callHook(vm, 'mounted');
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created');

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      vm.$el = el;

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction(template);
        options.render = render;
      }

      mountComponent(vm); // 组建挂在
    };
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    // 如果tag是一个组件，应该渲染一个组件的vnode
    if (isReservedTag(tag)) {
      return vnode(vm, tag, data, data.key, children, undefined);
    } else {
      var Ctor = vm.$options.components[tag];
      return createComponent(vm, tag, data, data.key, children, Ctor);
    }
  } // 创建组件的虚拟节点

  function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      Ctor = vm.$options._base.extend(Ctor);
    }

    data.hook = {
      // 渲染组件时，需要调用此初始化方法
      init: function init(vnode) {
        var vm = vnode.componentInstance = new Ctor({
          _isComponent: true
        }); // new Sub() Vue.extend实现

        vm.$mount();
      }
    };
    return vnode(vm, "vue-component-".concat(tag), data, key, undefined, undefined, {
      Ctor: Ctor,
      children: children
    });
  }

  function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, data, key, children, text, componentOptions) {
    return {
      vm: vm,
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      // createElement
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function (text) {
      // createTextElement
      return createTextElement(this, text);
    };

    Vue.prototype._s = function (val) {
      // stringify
      if (_typeof(val) === 'object') {
        return JSON.stringify(val);
      }

      return val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render; // compileToFunction执行结果

      var vnode = render.call(vm);
      return vnode;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue); // _render

  lifecycleMixin(Vue); // _update

  stateMixin(Vue); // watcher

  initGlobalApi(Vue);
  var oldTemplate = "<div>\n  <li key=\"c\">C</li>\n  <li key=\"a\">A</li>\n  <li key=\"b\">B</li>\n  <li key=\"d\">D</li>\n</div>";
  var vm1 = new Vue({
    data: {
      message: 'hello world'
    }
  });
  var render1 = compileToFunction(oldTemplate);
  var oldVnode = render1.call(vm1);
  document.body.appendChild(createElm(oldVnode));
  var newTemplate = "<div>\n  <li key=\"b\">B</li>\n  <li key=\"c\">C</li>\n  <li key=\"D\">D</li>\n  <li key=\"a\">A</li>\n</div>";
  var vm2 = new Vue({
    data: {
      message: 'zf'
    }
  });
  var render2 = compileToFunction(newTemplate);
  var newVnode = render2.call(vm2);
  setTimeout(function () {
    // 根据信的虚拟节点更新老的节点
    patch(oldVnode, newVnode);
  }, 1000);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
