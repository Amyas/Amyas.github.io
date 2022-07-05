function vnode(vm, tag, data, key, children, text) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
  };
}

function createElement(vm, tag, data = {}, ...children) {
  return vnode(vm, tag, data, data.key, children);
}

function createTextElement(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function patch(oldVnode, vnode) {
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
        el.insertBefore(moveNode.el, oldStartVnode.el);
        patch(moveNode, newStartVnode);
      }
      newStartVnode = newChildren[++newStartIndex];
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      const anchor =
        newChildren[newEndIndex + 1] === null
          ? null
          : newChildren[newEndIndex + 1].el;
      el.insertBefore(createElm(newChildren[i]), anchor);
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldChildren[i] !== null) {
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

function createElm(vnode) {
  const { tag, children, text } = vnode;
  if (typeof tag === "string") {
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
