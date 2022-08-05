var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    KeepAlive: () => KeepAlive,
    LifyCycle: () => LifyCycle,
    ReactiveEffect: () => ReactiveEffect,
    computed: () => computed,
    createRenderer: () => createRenderer,
    createVNode: () => createVNode,
    defineAsyncComponent: () => defineAsyncComponent,
    effect: () => effect,
    getCurrentInstance: () => getCurrentInstance,
    h: () => h,
    inject: () => inject,
    onBeforeMount: () => onBeforeMount,
    onMounted: () => onMounted,
    onUpdated: () => onUpdated,
    provide: () => provide,
    proxyRefs: () => proxyRefs,
    reactive: () => reactive,
    ref: () => ref,
    render: () => render,
    setCurrentInstance: () => setCurrentInstance,
    toRef: () => toRef,
    toRefs: () => toRefs,
    watch: () => watch
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isFunction = (value) => {
    return typeof value === "function";
  };
  var isString = (value) => {
    return typeof value === "string";
  };
  var isArray = Array.isArray;
  var isNumber = (value) => {
    return typeof value === "number";
  };
  var hasOwnPropertry = Object.prototype.hasOwnProperty;
  var hasOwn = (obj, key) => hasOwnPropertry.call(obj, key);
  function invokerFns(fns) {
    for (let i = 0; i < fns.length; i++) {
      fns[i]();
    }
  }

  // packages/runtime-core/src/createVNode.ts
  var Text = Symbol("text");
  function isVNode(value) {
    return !!value.__v_isVNode;
  }
  function isSameVNode(v1, v2) {
    return v1.type === v2.type && v1.key === v2.key;
  }
  function createVNode(type, props = null, children = null) {
    let shapeFlags = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0;
    const vnode = {
      __v_isVNode: true,
      type,
      props,
      children,
      key: props && props.key,
      el: null,
      shapeFlags
    };
    if (children !== void 0) {
      let temp = 0;
      if (isArray(children)) {
        temp = ShapeFlags.ARRAY_CHILDREN;
      } else if (isObject(children)) {
        temp = ShapeFlags.SLOTS_CHILDREN;
      } else {
        children = String(children);
        temp = ShapeFlags.TEXT_CHILDREN;
      }
      vnode.shapeFlags = vnode.shapeFlags | temp;
    }
    return vnode;
  }
  var ShapeFlags = /* @__PURE__ */ ((ShapeFlags2) => {
    ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags2[ShapeFlags2["FUNCTIONAL_COMPONENT"] = 2] = "FUNCTIONAL_COMPONENT";
    ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
    ShapeFlags2[ShapeFlags2["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
    ShapeFlags2[ShapeFlags2["TELEPORT"] = 64] = "TELEPORT";
    ShapeFlags2[ShapeFlags2["SUSPENSE"] = 128] = "SUSPENSE";
    ShapeFlags2[ShapeFlags2["COMPONENT_SHOULD_KEEP_ALIVE"] = 256] = "COMPONENT_SHOULD_KEEP_ALIVE";
    ShapeFlags2[ShapeFlags2["COMPONENT_KEPT_ALIVE"] = 512] = "COMPONENT_KEPT_ALIVE";
    ShapeFlags2[ShapeFlags2["COMPONENT"] = 6] = "COMPONENT";
    return ShapeFlags2;
  })(ShapeFlags || {});

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  function cleanEffect(effect2) {
    let deps = effect2.deps;
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    effect2.deps.length = 0;
  }
  var ReactiveEffect = class {
    constructor(fn, scheduler) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.parent = null;
      this.deps = [];
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
  };
  var targetMap = /* @__PURE__ */ new WeakMap();
  function trigger(target, key, value) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let effects = depsMap.get(key);
    triggerEffects(effects);
  }
  function triggerEffects(effects) {
    if (effects) {
      effects = new Set(effects);
      effects.forEach((effect2) => {
        if (effect2 !== activeEffect) {
          if (effect2.scheduler) {
            effect2.scheduler();
          } else {
            effect2.run();
          }
        }
      });
    }
  }
  function track(target, key) {
    if (activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let deps = depsMap.get(key);
      if (!deps) {
        depsMap.set(key, deps = /* @__PURE__ */ new Set());
      }
      trackEffects(deps);
    }
  }
  function trackEffects(deps) {
    let shouldTrack = !deps.has(activeEffect);
    if (shouldTrack) {
      deps.add(activeEffect);
      activeEffect.deps.push(deps);
    }
  }
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }

  // packages/reactivity/src/baseHandler.ts
  function isReactive(value) {
    return value && value["__v_isReactive" /* IS_REACTIVE */];
  }
  var baseHandler = {
    get(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) {
        return true;
      }
      track(target, key);
      let res = Reflect.get(target, key, receiver);
      if (isObject(res)) {
        return reactive(res);
      }
      return res;
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (oldValue !== value) {
        let result = Reflect.set(target, key, value, receiver);
        trigger(target, key, value);
        return result;
      }
    }
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target)) {
      return target;
    }
    if (target["__v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    const existing = reactiveMap.get(target);
    if (existing) {
      return existing;
    }
    const proxy = new Proxy(target, baseHandler);
    reactiveMap.set(target, proxy);
    return proxy;
  }

  // packages/reactivity/src/computed.ts
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
  var ComputedRefImpl = class {
    constructor(getter, setter) {
      this.getter = getter;
      this.setter = setter;
      this._dirty = true;
      this.__v_isRef = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerEffects(this.deps);
        }
      });
    }
    get value() {
      if (activeEffect) {
        trackEffects(this.deps || (this.deps = /* @__PURE__ */ new Set()));
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
  };

  // packages/reactivity/src/watch.ts
  function traversal(value, set = /* @__PURE__ */ new Set()) {
    if (!isObject(value)) {
      return value;
    }
    if (set.has(value)) {
      return value;
    }
    set.add(value);
    for (let key in value) {
      traversal(value[key], set);
    }
    return value;
  }
  function watch(source, callback) {
    let get;
    if (isReactive(source)) {
      get = () => traversal(source);
    } else if (isFunction(source)) {
      get = source;
    }
    let oldValue;
    let cleanup;
    const onCleanup = (fn) => {
      cleanup = fn;
    };
    const job = () => {
      cleanup && cleanup();
      let newValue = effect2.run();
      callback(newValue, oldValue, onCleanup);
    };
    const effect2 = new ReactiveEffect(get, job);
    oldValue = effect2.run();
  }

  // packages/reactivity/src/ref.ts
  function ref(value) {
    return new RefImpl(value);
  }
  function proxyRefs(object) {
    return new Proxy(object, {
      get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        return result.__v_isRef ? result.value : result;
      },
      set(target, key, value, receiver) {
        if (target[key].__v_isRef) {
          target[key].value = value;
          return true;
        }
        return Reflect.set(target, key, value, receiver);
      }
    });
  }
  function toRefs(target) {
    let result = {};
    for (let key in target) {
      result[key] = toRef(target, key);
    }
    return result;
  }
  function toRef(target, key) {
    return new ObjectImpl(target, key);
  }
  var ObjectImpl = class {
    constructor(target, key) {
      this.target = target;
      this.key = key;
      this.__v_isRef = true;
    }
    get value() {
      return this.target[this.key];
    }
    set value(newValue) {
      this.target[this.key] = newValue;
    }
  };
  function toReactive(value) {
    return isObject(value) ? reactive(value) : value;
  }
  var RefImpl = class {
    constructor(rawValue) {
      this.rawValue = rawValue;
      this.__v_isRef = true;
      this._value = toReactive(rawValue);
    }
    get value() {
      trackEffects(this.dep || (this.dep = /* @__PURE__ */ new Set()));
      return this._value;
    }
    set value(newValue) {
      if (newValue === this.rawValue)
        return;
      this._value = toReactive(newValue);
      this.rawValue = newValue;
      triggerEffects(this.dep);
    }
  };

  // packages/runtime-core/src/h.ts
  function h(type, propsOrChildren, children) {
    const l = arguments.length;
    if (l === 2) {
      if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l === 3 && isVNode(children)) {
        children = [children];
      } else if (l > 3) {
        children = Array.from(arguments).slice(2);
      }
      return createVNode(type, propsOrChildren, children);
    }
  }

  // packages/runtime-core/src/component.ts
  var instance = null;
  var getCurrentInstance = () => instance;
  var setCurrentInstance = (i) => instance = i;
  function createComponentInstance(vnode, parent) {
    const instance2 = {
      ctx: {},
      data: null,
      vnode,
      subTree: null,
      inMounted: false,
      update: null,
      render: null,
      propsOptions: vnode.type.props || {},
      props: {},
      attrs: {},
      proxy: null,
      setupState: {},
      slots: {},
      parent,
      provides: parent ? parent.provides : /* @__PURE__ */ Object.create(null)
    };
    return instance2;
  }
  function initSlots(instance2, children) {
    if (instance2.vnode.shapeFlags & 32 /* SLOTS_CHILDREN */) {
      instance2.slots = children;
    }
  }
  function setupComponent(instance2) {
    const { type, props, children } = instance2.vnode;
    const { data, render: render2, setup } = type;
    initProps(instance2, props);
    initSlots(instance2, children);
    instance2.proxy = new Proxy(instance2, instanceProxy);
    if (data) {
      if (!isFunction(data)) {
        return console.warn("data must a funciton");
      }
      instance2.data = reactive(data.call({}));
    }
    if (setup) {
      const context = {
        emit: (eventName, ...args) => {
          const invoker = instance2.vnode.props[eventName];
          invoker && invoker(...args);
        },
        attrs: instance2.attrs,
        slots: instance2.slots
      };
      setCurrentInstance(instance2);
      const setupResult = setup(instance2.props, context);
      setCurrentInstance(null);
      if (isFunction(setupResult)) {
        instance2.render = setupResult;
      } else if (isObject(setupResult)) {
        instance2.setupState = proxyRefs(setupResult);
      }
    }
    if (!instance2.render) {
      if (render2) {
        instance2.render = render2;
      } else {
      }
    }
  }
  var publicProperites = {
    $attrs: (instance2) => instance2.attrs,
    $slots: (instance2) => instance2.slots
  };
  var instanceProxy = {
    get(target, key, receiver) {
      const { data, props, setupState } = target;
      if (data && hasOwn(data, key)) {
        return data[key];
      } else if (setupState && hasOwn(setupState, key)) {
        return setupState[key];
      } else if (props && hasOwn(props, key)) {
        return props[key];
      }
      const getter = publicProperites[key];
      if (getter) {
        return getter(target);
      }
    },
    set(target, key, value, receiver) {
      const { data, props, setupState } = target;
      if (data && hasOwn(data, key)) {
        data[key] = value;
      } else if (setupState && hasOwn(setupState, key)) {
        setupState[key] = value;
      } else if (props && hasOwn(props, key)) {
        console.warn("props not update");
        return false;
      }
      return true;
    }
  };
  function initProps(instance2, rawProps) {
    const props = {};
    const attrs = {};
    const options = instance2.propsOptions;
    if (rawProps) {
      for (let key in rawProps) {
        const value = rawProps[key];
        if (key in options) {
          props[key] = value;
        } else {
          attrs[key] = value;
        }
      }
    }
    instance2.props = reactive(props);
    instance2.attrs = attrs;
  }

  // packages/runtime-core/src/scheduler.ts
  var queue = [];
  var isFlushing = false;
  var resolvePromise = Promise.resolve();
  function queueJob(job) {
    if (!queue.includes(job)) {
      queue.push(job);
    }
    if (!isFlushing) {
      isFlushing = true;
      resolvePromise.then(() => {
        isFlushing = false;
        const copyQueue = queue.slice(0);
        queue.length = 0;
        for (let i = 0; i < copyQueue.length; i++) {
          const job2 = copyQueue[i];
          job2();
        }
        copyQueue.length = 0;
      });
    }
  }

  // packages/runtime-core/src/renderer.ts
  function createRenderer(options) {
    const {
      createElement: hostCreateElement,
      createTextNode: hostCreateTextNode,
      insert: hostInsert,
      remove: hostRemove,
      querySelector: hostQuerySelector,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setText: hostSetText,
      setElementText: hostSetElementText,
      patchProp: hostPatchProp
    } = options;
    function normalize(children, i) {
      if (isString(children[i]) || isNumber(children[i])) {
        children[i] = createVNode(Text, null, children[i]);
      }
      return children[i];
    }
    function mountChildren(children, container, parent) {
      for (let i = 0; i < children.length; i++) {
        let child = normalize(children, i);
        patch(null, child, container, parent);
      }
    }
    function patchProps(oldProps, newProps, el) {
      if (oldProps === null)
        oldProps = {};
      if (newProps === null)
        newProps = {};
      for (let key in newProps) {
        hostPatchProp(el, key, oldProps[key], newProps[key]);
      }
      for (let key in oldProps) {
        if (newProps[key] === null) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
    }
    function mountElement(vnode, container, anchor, parent) {
      const { type, props, children, shapeFlags } = vnode;
      const el = vnode.el = hostCreateElement(type);
      if (props) {
        patchProps(null, props, el);
      }
      if (shapeFlags & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, children);
      }
      if (shapeFlags & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, el, parent);
      }
      hostInsert(el, container, anchor);
    }
    function processText(n1, n2, container) {
      if (n1 === null) {
        hostInsert(n2.el = hostCreateTextNode(n2.children), container);
      }
    }
    function processElement(n1, n2, container, anchor, parent) {
      if (n1 === null) {
        mountElement(n2, container, anchor, parent);
      } else {
        patchElement(n1, n2, parent);
      }
    }
    function patchElement(n1, n2, parent) {
      const el = n2.el = n1.el;
      const oldProps = n1.props;
      const newProps = n2.props;
      patchProps(oldProps, newProps, el);
      patchChildren(n1, n2, el, parent);
    }
    function unmountChildren(children, parent) {
      children.forEach((child) => {
        unmount(child, parent);
      });
    }
    function patchChildren(n1, n2, el, parent) {
      const c1 = n1.children;
      const c2 = n2.children;
      const prevShapeFlag = n1.shapeFlags;
      const shapeFlag = n2.shapeFlags;
      if (shapeFlag & 8 /* TEXT_CHILDREN */) {
        if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
          unmountChildren(c1, parent);
        }
        if (c1 !== c2) {
          hostSetElementText(el, c2);
        }
      } else {
        if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
          if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            patchKeyedChildren(c1, c2, el, parent);
          } else {
            unmountChildren(c1, parent);
          }
        } else {
          if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
            hostSetElementText(el, "");
          }
          if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            mountChildren(c2, el, parent);
          }
        }
      }
    }
    function patchKeyedChildren(c1, c2, el, parent) {
      let i = 0;
      let e1 = c1.length - 1;
      let e2 = c2.length - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i];
        if (isSameVNode(n1, n2)) {
          patch(n1, n2, el);
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2];
        if (isSameVNode(n1, n2)) {
          patch(n1, n2, el);
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          while (i <= e2) {
            const nextPos = e2 + 1;
            const anchor = c2.length <= nextPos ? null : c2[nextPos].el;
            patch(null, c2[i], el, anchor);
            i++;
          }
        }
      } else if (i > e2) {
        if (i <= e1) {
          while (i <= e1) {
            unmount(c1[i], parent);
            i++;
          }
        }
      }
      let s1 = i;
      let s2 = i;
      let toBePatched = e2 - s2 + 1;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (let i2 = s2; i2 <= e2; i2++) {
        keyToNewIndexMap.set(c2[i2].key, i2);
      }
      for (let i2 = s1; i2 <= e1; i2++) {
        const oldVNode = c1[i2];
        const newIndex = keyToNewIndexMap.get(oldVNode.key);
        if (!newIndex) {
          unmount(oldVNode, parent);
        } else {
          patch(oldVNode, c2[newIndex], el);
        }
      }
      for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
        const currentIndex = s2 + i2;
        const child = c2[currentIndex];
        const anchor = currentIndex + 1 < c2.length ? c2[currentIndex + 1].el : null;
        if (!child.el) {
          patch(null, child, el, anchor);
        } else {
          hostInsert(child.el, el, anchor);
        }
      }
    }
    function unmount(n1, parent) {
      const { shapeFlags, component } = n1;
      if (shapeFlags & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
        parent.ctx.deactivate(n1);
      }
      if (shapeFlags & 6 /* COMPONENT */) {
        return unmount(component.subTree, parent);
      }
      hostRemove(n1.el);
    }
    function patch(n1, n2, container, anchor = null, parent = null) {
      if (n1 && !isSameVNode(n1, n2)) {
        unmount(n1, parent);
        n1 = null;
      }
      const { type, shapeFlags } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container);
          break;
        default:
          if (shapeFlags & 1 /* ELEMENT */) {
            processElement(n1, n2, container, anchor, parent);
          } else if (shapeFlags & 4 /* STATEFUL_COMPONENT */) {
            processComponent(n1, n2, container, anchor, parent);
          }
          break;
      }
    }
    function processComponent(n1, n2, container, anchor, parent) {
      if (n1 === null) {
        if (n2.shapeFlags & 512 /* COMPONENT_KEPT_ALIVE */) {
          parent.ctx.active(n2, container, anchor);
        } else {
          mountComponent(n2, container, anchor, parent);
        }
      } else {
        updateComponent(n1, n2);
      }
    }
    function shouldComponentUpdate(n1, n2) {
      const prevProps = n1.props;
      const nextProps = n2.props;
      if (hasChangeProps(prevProps, nextProps)) {
        return true;
      }
      if (n1.children || n2.children) {
        return true;
      }
      return false;
    }
    function updateComponent(n1, n2) {
      const instance2 = n2.component = n1.component;
      if (shouldComponentUpdate(n1, n2)) {
        instance2.next = n2;
        instance2.update();
      }
    }
    function updateProps(instance2, prevProps, nextProps) {
      if (hasChangeProps(prevProps, nextProps)) {
        for (let key in nextProps) {
          instance2.props[key] = nextProps[key];
        }
        for (let key in instance2.props) {
          if (!(key in nextProps)) {
            delete instance2.props;
          }
        }
      }
    }
    function hasChangeProps(prevProps, nextProps) {
      for (let key in nextProps) {
        if (nextProps[key] !== prevProps[key]) {
          return true;
        }
      }
      return false;
    }
    function mountComponent(vnode, container, anchor, parent) {
      const instance2 = vnode.component = createComponentInstance(vnode, parent);
      instance2.ctx.renderer = {
        createElement: hostCreateElement,
        move(vnode2, container2) {
          hostInsert(vnode2.component.subTree.el, container2);
        },
        unmount
      };
      setupComponent(instance2);
      setupRenderEffect(instance2, container, anchor);
    }
    function setupRenderEffect(instance2, container, anchor) {
      const componentUpdate = () => {
        const { render: render3, data } = instance2;
        if (!instance2.isMounted) {
          const { bm, m } = instance2;
          if (bm) {
            invokerFns(bm);
          }
          const subTree = render3.call(instance2.proxy);
          patch(null, subTree, container, anchor, instance2);
          instance2.subTree = subTree;
          if (m) {
            invokerFns(m);
          }
          instance2.isMounted = true;
        } else {
          const next = instance2.next;
          if (next) {
            updateComponentPreRender(instance2, next);
          }
          const subTree = render3.call(instance2.proxy);
          patch(instance2.subTree, subTree, container, anchor, instance2);
          if (instance2.u) {
            invokerFns(instance2.u);
          }
          instance2.subTree = subTree;
        }
      };
      const effect2 = new ReactiveEffect(componentUpdate, () => queueJob(instance2.update));
      const update = instance2.update = effect2.run.bind(effect2);
      update();
    }
    function updateComponentPreRender(instance2, next) {
      instance2.next = null;
      instance2.vnode = next;
      updateProps(instance2, instance2.props, next.props);
      Object.assign(instance2.slots, next.children);
    }
    function render2(vnode, container) {
      if (vnode === null) {
        if (container._vnode) {
          unmount(container._vnode, null);
        }
      } else {
        patch(container._vnode || null, vnode, container);
      }
      container._vnode = vnode;
    }
    return {
      render: render2
    };
  }

  // packages/runtime-core/src/apiLifyCycle.ts
  var LifyCycle = /* @__PURE__ */ ((LifyCycle2) => {
    LifyCycle2["BEFORE_MOUNT"] = "bm";
    LifyCycle2["MOUNT"] = "m";
    LifyCycle2["UPDATE"] = "u";
    return LifyCycle2;
  })(LifyCycle || {});
  function createInvoker(type) {
    return function(hook, currentInstance = instance) {
      if (currentInstance) {
        const lifeCycles = currentInstance[type] || (currentInstance[type] = []);
        const warpHook = () => {
          setCurrentInstance(currentInstance);
          hook.call(currentInstance);
          setCurrentInstance(null);
        };
        lifeCycles.push(warpHook);
      }
    };
  }
  var onBeforeMount = createInvoker("bm" /* BEFORE_MOUNT */);
  var onMounted = createInvoker("m" /* MOUNT */);
  var onUpdated = createInvoker("u" /* UPDATE */);

  // packages/runtime-core/src/apiInject.ts
  function provide(key, value) {
    if (!instance)
      return;
    const parentProvides = instance.parent && instance.parent.provides;
    let currentProvides = instance.provides;
    if (currentProvides === parentProvides) {
      currentProvides = instance.provides = Object.create(parentProvides);
    }
    currentProvides[key] = value;
  }
  function inject(key, defaultValue) {
    var _a;
    if (!instance)
      return;
    const provides = (_a = instance.parent) == null ? void 0 : _a.provides;
    if (provides && key in provides) {
      return provides[key];
    }
    return defaultValue;
  }

  // packages/runtime-core/src/deinfeAsyncComponent.ts
  function defineAsyncComponent(loaderOptions) {
    if (isFunction(loaderOptions)) {
      loaderOptions = {
        loader: loaderOptions
      };
    }
    let Component = null;
    return {
      setup() {
        const {
          loader,
          timeout,
          errorComponent,
          loadingComponent,
          delay,
          onError
        } = loaderOptions;
        const loaded = ref(false);
        const error = ref(false);
        const loading = ref(false);
        if (timeout) {
          setTimeout(() => {
            error.value = true;
          }, timeout);
        }
        let timer;
        if (delay) {
          timer = setTimeout(() => {
            loading.value = true;
          }, delay);
        } else {
          loading.value = true;
        }
        function load() {
          return loader().catch((err) => {
            if (onError) {
              return new Promise((resolve, reject) => {
                const retry = () => resolve(load());
                const fail = () => reject();
                onError(retry, fail);
              });
            } else {
              throw err;
            }
          });
        }
        load().then((value) => {
          loaded.value = true;
          Component = value;
        }).catch((err) => {
          error.value = true;
        }).finally(() => {
          clearTimeout(timer);
          loading.value = false;
        });
        return () => {
          if (loaded.value) {
            return h(Component, {}, {});
          } else if (error.value && errorComponent) {
            return h(errorComponent, {}, {});
          } else if (loading.value && loadingComponent) {
            return h(loadingComponent, {}, {});
          } else {
            return h("span", {}, {});
          }
        };
      }
    };
  }

  // packages/runtime-core/src/keepAlive.ts
  var KeepAlive = {
    __isKeepAlive: true,
    props: {
      max: {}
    },
    setup(props, { slots }) {
      const keys = /* @__PURE__ */ new Set();
      const cache = /* @__PURE__ */ new Map();
      const instance2 = getCurrentInstance();
      const { createElement, move, unmount } = instance2.ctx.renderer;
      const storageContainer = createElement("div");
      instance2.ctx.active = (n2, container, anchor) => {
        move(n2, container, anchor);
      };
      instance2.ctx.deactivate = (n1) => {
        move(n1, storageContainer);
      };
      let pendingCatchKey = null;
      const onCacheVnode = () => {
        cache.set(pendingCatchKey, instance2.subTree);
      };
      onMounted(onCacheVnode);
      onUpdated(onCacheVnode);
      const pruneCacheEntry = (vnode) => {
        const subTree = cache.get(vnode);
        resetFlg(subTree);
        unmount(subTree);
        cache.delete(vnode);
        keys.delete(vnode);
      };
      const resetFlg = (vnode) => {
        if (vnode.shapeFlags & 512 /* COMPONENT_KEPT_ALIVE */) {
          vnode.shapeFlags -= 512 /* COMPONENT_KEPT_ALIVE */;
        }
        if (vnode.shapeFlags & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
          vnode.shapeFlags -= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
        }
      };
      return () => {
        const vnode = slots.default();
        if (!(vnode.shapeFlags & 4 /* STATEFUL_COMPONENT */)) {
          return vnode;
        }
        const currentComponent = vnode.type;
        const key = vnode.key === null ? currentComponent : vnode.key;
        pendingCatchKey = key;
        const cacheVnode = cache.get(key);
        if (cacheVnode) {
          vnode.component = cacheVnode.component;
          vnode.shapeFlags = vnode.shapeFlags | 512 /* COMPONENT_KEPT_ALIVE */;
        } else {
          keys.add(key);
          if (props.max && keys.size > props.max) {
            pruneCacheEntry(keys.values().next().value);
          }
        }
        vnode.shapeFlags = vnode.shapeFlags | 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
        return vnode;
      };
    }
  };

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createTextNode(text) {
      return document.createTextNode(text);
    },
    insert(element, container, anchor = null) {
      container.insertBefore(element, anchor);
    },
    remove(child) {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    querySelector(selectors) {
      return document.querySelector(selectors);
    },
    parentNode(child) {
      return child.parentNode;
    },
    nextSibling(child) {
      return child.nextSibling;
    },
    setText(element, text) {
      element.nodeValue = text;
    },
    setElementText(element, text) {
      element.textContent = text;
    }
  };

  // packages/runtime-dom/src/patch-prop/patchClass.ts
  function patchClass(el, nextValue) {
    if (nextValue === null) {
      el.removeAttribute("class");
    } else {
      el.className = nextValue;
    }
  }

  // packages/runtime-dom/src/patch-prop/patchStyle.ts
  function patchStyle(el, preValue, nextValue) {
    if (preValue === null)
      preValue = {};
    if (nextValue === null)
      nextValue = {};
    const style = el.style;
    for (let key in nextValue) {
      style.setProperty(key, nextValue[key]);
    }
    if (preValue) {
      for (let key in preValue) {
        if (nextValue[key] === null) {
          style[key] = null;
        }
      }
    }
  }

  // packages/runtime-dom/src/patch-prop/patchEvent.ts
  function createInvoker2(preValue) {
    const invoker = (e) => {
      invoker.value(e);
    };
    invoker.value = preValue;
    return invoker;
  }
  function patchEvent(el, key, nextValue) {
    const invokers = el._vei || (el._vei = {});
    const exitingInvoker = invokers[key];
    if (exitingInvoker && nextValue) {
      exitingInvoker.value = nextValue;
    } else {
      const eventName = key.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = createInvoker2(nextValue);
        invokers[key] = invoker;
        el.addEventListener(eventName, invoker);
      } else if (exitingInvoker) {
        el.removeEventListener(eventName, exitingInvoker);
        invokers[key] = null;
      }
    }
  }

  // packages/runtime-dom/src/patch-prop/patchAttr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }

  // packages/runtime-dom/src/patchProps.ts
  var patchProp = (el, key, preValue, nextValue) => {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, preValue, nextValue);
    } else if (/on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  };

  // packages/runtime-dom/src/index.ts
  var renderOptions = __spreadValues({ patchProp }, nodeOps);
  function render(vnode, container) {
    let { render: render2 } = createRenderer(renderOptions);
    return render2(vnode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
