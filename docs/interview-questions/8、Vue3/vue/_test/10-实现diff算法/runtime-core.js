const Text = Symbol("text");
const ShapeFlags = {
  ELEMENT: 1,
  FUNCTIONAL_COMPONENT: 1 << 1,
  STATEFUL_COMPONENT: 1 << 2,
  TEXT_CHILDREN: 1 << 3,
  ARRAY_CHILDREN: 1 << 4,
  SLOTS_CHILDREN: 1 << 5,
  TELEPORT: 1 << 6,
  SUSPENSE: 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE: 1 << 8,
  COMPONENT_KEEP_ALIVE: 1 << 9,
};
ShapeFlags.COMPONENT =
  ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT;

function isVNode(value) {
  return !!value.__v_isVNode;
}

function createVNode(type, props = null, children = null) {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;

  const vnode = {
    __v_isVNode: true,
    type,
    props,
    children,
    key: props && props.key,
    el: null,
    shapeFlag,
  };

  if (children) {
    let temp = 0;
    if (isArray(children)) {
      temp = ShapeFlags.ARRAY_CHILDREN;
    } else {
      children = String(children);
      temp = ShapeFlags.TEXT_CHILDREN;
    }
    vnode.shapeFlag = vnode.shapeFlag | temp;
  }

  return vnode;
}

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
    patchProp: hostPatchProp,
  } = options;

  function patch(n1, n2, container) {
    const { type, shapeFlag } = n2;

    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container);
        }
        break;
    }
  }

  function processText(n1, n2, container) {
    if (n1 === null) {
      hostInsert((n2.el = hostCreateTextNode(n2.children)), container);
    }
  }

  function processElement(n1, n2, container) {
    if (n1 === null) {
      mountElement(n2, container);
    }
  }

  function mountElement(vnode, container) {
    const { type, props, children, shapeFlag } = vnode;

    const el = (vnode.el = hostCreateElement(type));

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    }

    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }

    hostInsert(el, container);
  }

  function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
      const child = normalize(children, i);
      patch(null, child, container);
    }
  }

  function normalize(children, i) {
    if (isString(children[i]) || isNumber(children[i])) {
      children[i] = createVNode(Text, null, children[i]);
    }
    return children[i];
  }

  function render(vnode, container) {
    if (vnode === null) {
    } else {
      patch(container._vnode || null, vnode, container);
    }

    container._vnode = vnode;
  }

  return {
    render,
  };
}
