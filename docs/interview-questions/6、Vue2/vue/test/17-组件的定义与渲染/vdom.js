function isReservedTag(tag) {
  const reservedTag = `a,h1,span,div,li,ul,p,img,button`;
  return reservedTag.includes(tag);
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions,
  };
}

function createElement(vm, tag, data = {}, ...children) {
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, data.key, children);
  } else {
    const Ctor = vm.$options.components[tag];
    return createComponentElement(vm, tag, data, data.key, children, Ctor);
  }
}

function createTextElement(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function createComponentElement(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }
  data.hook = {
    init(vnode) {
      const vm = (vnode.componentInstance = new Ctor({ _isComponent: true }));
      vm.$mount();
    },
  };

  return vnode(vm, `vue-component-${tag}`, data, key, undefined, undefined, {
    Ctor,
    children,
  });
}

function patch(oldVnode, vnode) {
  if (!oldVnode) {
    return createElm(vnode);
  }

  if (oldVnode.nodeType === 1) {
    const parentEl = oldVnode.parentNode;
    const elm = createElm(vnode);
    parentEl.insertBefore(elm, oldVnode.nextSibling);
    parentEl.removeChild(oldVnode);
    return elm;
  } else {
    if (oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    }

    const el = (vnode.el = oldVnode.el);

    if (vnode.tag === undefined) {
      if (oldVnode.text !== vnode.text) {
        el.textContent = vnode.text;
      }
      return;
    }

    patchProps(vnode, oldVnode.data);

    const oldChildren = oldVnode.children || [];
    const newChildren = vnode.children || [];

    if (oldChildren.length > 0 && newChildren.length > 0) {
      patchChildren(el, oldChildren, newChildren);
    } else if (newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        el.appendChild(createElm(newChildren[i]));
      }
    } else if (oldChildren.length > 0) {
      el.innerHTML = "";
    }

    return el;
  }
}

function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}

function patchChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldChildren.length - 1];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newChildren.length - 1];

  function makeIndexByKey(children) {
    return children.reduce((total, current, index) => {
      if (current.key) {
        total[current.key] = index;
      }
      return total;
    }, {});
  }

  const keysMap = makeIndexByKey(oldChildren);

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    }
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode);
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode);
      el.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else {
      const moveIndex = keysMap[newStartVnode.key];
      if (!moveIndex) {
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        const moveNode = oldChildren[moveIndex];
        oldChildren[moveIndex] = null;
        patch(moveNode, newStartVnode);
        el.insertBefore(moveNode.el, oldStartVnode.el);
      }
      newStartVnode = newChildren[++newStartIndex];
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      const anchor = newChildren[newEndIndex + 1]
        ? newChildren[newEndIndex + 1].el
        : null;
      el.insertBefore(createElm(newChildren[i]), anchor);
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldChildren[i]) {
        el.removeChild(oldChildren[i].el);
      }
    }
  }
}

function patchProps(vnode, oldProps = {}) {
  const newProps = vnode.data || {};
  const el = vnode.el;

  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key);
    }
  }

  for (let key in newProps) {
    el.setAttribute(key, newProps[key]);
  }
}

function createComponent(vnode) {
  let i = vnode.data;
  if ((i = i.hook) && (i = i.init)) {
    i(vnode);
  }
  if (vnode.componentInstance) {
    return true;
  }
}

function createElm(vnode) {
  const { tag, children, text } = vnode;
  if (typeof tag === "string") {
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el;
    }
    vnode.el = document.createElement(tag);
    patchProps(vnode);
    if (children) {
      children.forEach((child) => {
        vnode.el.appendChild(createElm(child));
      });
    }
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
