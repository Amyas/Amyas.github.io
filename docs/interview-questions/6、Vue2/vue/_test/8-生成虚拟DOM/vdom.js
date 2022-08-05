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
  return vnode(vm, tag, data, data.key, children, undefined);
}

function createTextElement(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}
