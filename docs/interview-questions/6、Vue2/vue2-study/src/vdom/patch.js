export function patch(oldVnode, vnode){
  if(oldVnode.nodeType === 1) { // 真是元素，第一次更新
    // 用vnode来生成真实dom替换原来的dom元素
    
    const parentEl = oldVnode.parentNode

    let elm = createElm(vnode) // 根据虚拟节点创建元素
    parentEl.insertBefore(elm, oldVnode.nextSibling)

    parentEl.removeChild(oldVnode)

    return elm
  }
}

function createElm(vnode) {
  let {
    tag,
    data,
    children,
    text,
    vm
  } = vnode

  if(typeof tag === 'string') { // 元素
    vnode.el = document.createElement(tag)

    children.forEach(child=>{
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}