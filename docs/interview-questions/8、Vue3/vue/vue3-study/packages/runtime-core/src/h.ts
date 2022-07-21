// h具备重载，不同的参数决定了不同的功能
// // 元素 内容
// console.log(h("h1", "hello"));
// // 元素 属性 内容
// console.log(h("h1", { style: { color: "red" } }, "hello"));
// // 元素 属性 多个儿子
// console.log(h("h1", { style: { color: "red" } }, ["hello", "world"]));
// // 元素 嵌套 元素
// console.log(h("h1", h("span", "hello")));
// // 元素 空属性 多儿子

import { isArray, isObject } from "@vue/shared";
import { isVNode, createVNode } from "./createVNode";

// console.log(h("h1", null, [h("span", "hello"), h("span", "world")]));
export function h(type, propsOrChildren, children) {
  const l = arguments.length;

  if (l === 2) {
    // 如果propsOrChildren是对象的话，可能是属性，也可能是儿子节点
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        // h('h1', h('span')) // __v_isVNode = true
        return createVNode(type, null, [propsOrChildren]);
      }
      // h('h1',{style:{color: 'red'}})
      return createVNode(type, propsOrChildren);
    } else {
      // h('h1', 'hello world')
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l === 3 && isVNode(children)) {
      // h('h1', null, h('span'))
      children = [children];
    } else if (l > 3) {
      // h('h1', null, h('span'), h('span'), h('span'))
      children = Array.from(arguments).slice(2);
    }
    return createVNode(type, propsOrChildren, children);
  }
}
