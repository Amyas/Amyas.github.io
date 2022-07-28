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

function isSameVnode(v1, v2) {
  return v1.type === v2.type && v1.key === v2.key;
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

  function patch(n1, n2, container, anchor) {
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      n1 = null;
    }

    const { type, shapeFlag } = n2;

    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor);
        }
        break;
    }
  }

  function processText(n1, n2, container) {
    if (n1 === null) {
      hostInsert((n2.el = hostCreateTextNode(n2.children)), container);
    }
  }

  function processElement(n1, n2, container, anchor) {
    if (n1 === null) {
      mountElement(n2, container, anchor);
    } else {
      patchElement(n1, n2);
    }
  }

  function mountElement(vnode, container, anchor) {
    const { type, props, children, shapeFlag } = vnode;

    const el = (vnode.el = hostCreateElement(type));

    if (props) {
      patchProps(null, props, el);
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    }

    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }

    hostInsert(el, container, anchor);
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

  function patchProps(oldProps, newProps, el) {
    if (oldProps === null) oldProps = {};
    if (newProps === null) newProps = {};

    for (let key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }

    for (let key in oldProps) {
      if (newProps[key] === null) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  }

  function patchElement(n1, n2) {
    const el = (n2.el = n1.el);
    const oldProps = n1.props;
    const newProps = n2.props;

    patchProps(oldProps, newProps, el);

    patchChildren(n1, n2, el);
  }

  function patchChildren(oldVnode, newVnode, el) {
    const oldChildren = oldVnode.children;
    const newChildren = newVnode.children;

    const oldShapeFlag = oldVnode.shapeFlag;
    const newShapeFlag = newVnode.shapeFlag;

    if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(oldChildren);
      }

      if (oldChildren !== newChildren) {
        hostSetElementText(el, newChildren);
      }
    } else {
      if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (newShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          patchKeyedChildren(oldChildren, newChildren, el);
        } else {
          unmountChildren(oldChildren);
        }
      } else {
        if (oldShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, "");
        }

        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(newChildren, el);
        }
      }
    }
  }

  function patchKeyedChildren(oldChildren, newChildren, el) {
    let index = 0;
    let oldLastIndex = oldChildren.length - 1;
    let newLastIndex = newChildren.length - 1;

    while (index <= oldLastIndex && index <= newLastIndex) {
      const oldVnode = oldChildren[index];
      const newVnode = newChildren[index];
      if (isSameVnode(oldVnode, newVnode)) {
        patch(oldVnode, newVnode, el);
      } else {
        break;
      }
      index++;
    }

    while (index <= oldLastIndex && index <= newLastIndex) {
      const oldVnode = oldChildren[oldLastIndex];
      const newVnode = newChildren[newLastIndex];
      if (isSameVnode(oldVnode, newVnode)) {
        patch(oldVnode, newVnode, el);
      } else {
        break;
      }
      oldLastIndex--;
      newLastIndex--;
    }

    if (index > oldLastIndex) {
      if (index <= newLastIndex) {
        while (index <= newLastIndex) {
          const nextPos = newLastIndex + 1;
          const anchor =
            newChildren.length <= nextPos ? null : newChildren[nextPos].el;
          patch(null, newChildren[index], el, anchor);
          index++;
        }
      }
    } else if (index > newLastIndex) {
      if (index <= oldLastIndex) {
        while (index <= oldLastIndex) {
          unmount(oldChildren[index]);
          index++;
        }
      }
    }

    let s1 = index;
    let s2 = index;

    let toBePatched = newLastIndex - s2 + 1;
    const keyToNewIndexMap = new Map();
    for (let i = s2; i <= oldLastIndex; i++) {
      keyToNewIndexMap.set(newChildren[i].key, i);
    }

    for (let i = s1; i <= oldLastIndex; i++) {
      const oldVnode = oldChildren[i];
      const newIndex = keyToNewIndexMap.get(oldVnode.key);

      if (!newIndex) {
        unmount(oldVnode);
      } else {
        patch(oldVnode, newChildren[newIndex], el);
      }
    }

    for (let i = toBePatched - 1; i >= 0; i--) {
      const currentIndex = s2 + 1;
      const child = newChildren[currentIndex];
      const anchor =
        currentIndex + 1 < newChildren.length
          ? newChildren[currentIndex + 1].el
          : null;

      if (child.el === null) {
        patch(null, child, el.anchor);
      } else {
        hostInsert(child.el, el, anchor);
      }
    }
  }

  function unmountChildren(children) {
    children.forEach((child) => {
      unmount(child);
    });
  }

  function unmount(vnode) {
    hostRemove(vnode.el);
  }

  function render(vnode, container) {
    if (vnode === null) {
      unmount(container._vnode);
    } else {
      patch(container._vnode || null, vnode, container);
    }

    container._vnode = vnode;
  }

  return {
    render,
  };
}
