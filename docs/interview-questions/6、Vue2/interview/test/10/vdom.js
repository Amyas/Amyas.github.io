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
  }
}

function createElm(vnode) {
  let { tag, children, text } = vnode;
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag);
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
