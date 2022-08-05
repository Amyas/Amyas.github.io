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
    let parentEl = oldVnode.parentNode;
    let elm = createElm(vnode);
    parentEl.insertBefore(elm, oldVnode.nextSibling);
    parentEl.removeChild(oldVnode);
    return elm;
  } else {
    if (oldVnode.tag !== vnode.tag) {
      return oldVnode.el.replaceChildren(createElm(vnode), oldVnode.el);
    }

    const el = (vnode.el = oldVnode.el);

    patchProps(vnode, oldVnode.data);

    const oldChildren = oldVnode.children || [];
    const newChildren = vnode.children || [];
    if (oldChildren.length > 0 && newChildren.length > 0) {
    } else if (newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        el.appendChild(createElm(newChildren[i]));
      }
    } else if (oldChildren.length > 0) {
      el.innerHTML = "";
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
  let { tag, children, text } = vnode;
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
