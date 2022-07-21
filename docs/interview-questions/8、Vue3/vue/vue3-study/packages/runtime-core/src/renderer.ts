import { isNumber, isString } from "@vue/shared";
import { createVNode, ShapeFlags, Text } from "./createVNode";

export function createRenderer(options) {
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

  function normalize(children, i) {
    if (isString(children[i]) || isNumber(children[i])) {
      // 给文本加表示
      children[i] = createVNode(Text, null, children[i]);
    }
    return children[i];
  }

  function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
      let child = normalize(children, i);
      // 子元素可能是文本节点
      patch(null, child, container);
    }
  }

  function mountElement(vnode, container) {
    const { type, props, children, shapeFlags } = vnode;

    // 因为我们后续需要对比虚拟节点的差异更新页面，所以需要保留对应的真实节点
    const el = (vnode.el = hostCreateElement(type));

    // children 不是数组就是文本
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    }
    if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }

    hostInsert(el, container);
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

  // n1 之前的节点
  // n2 现在的节点
  function patch(n1, n2, container) {
    const { type, shapeFlags } = n2;

    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container);
        }
        break;
    }
  }

  function render(vnode, container) {
    if (vnode === null) {
      // 卸载元素
    } else {
      // 初始化、更新
      patch(container._vnode || null, vnode, container);
    }

    container._vnode = vnode;
  }
  return {
    render,
  };
}
