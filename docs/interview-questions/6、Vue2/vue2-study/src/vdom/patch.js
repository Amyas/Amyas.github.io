export function patch(oldVnode, vnode){
  if(!oldVnode) {
    return createElm(vnode) // 如果没有el，就是组件，直接根据虚拟节点返回真实节点
  }
  if(oldVnode.nodeType === 1) { // 真是元素，第一次更新
    // 用vnode来生成真实dom替换原来的dom元素
    
    const parentEl = oldVnode.parentNode

    let elm = createElm(vnode) // 根据虚拟节点创建元素
    parentEl.insertBefore(elm, oldVnode.nextSibling)

    parentEl.removeChild(oldVnode)

    return elm
  }
}

function createComponent(vnode){
  let i = vnode.data
  // i = vnode.data.hook -> i = vnode.data.hook.init
  // 判断+复值
  if((i = i.hook) && (i = i.init)) {
    i(vnode) // 调用组件的init方法
  }
  if(vnode.componentInstance) {// 说明子组件new 完成了，并且创建了真实dom
    return true
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
    if(createComponent(vnode)) {
      // 返回组件对应的真实节点
      return vnode.componentInstance.$el
    }

    vnode.el = document.createElement(tag)

    children.forEach(child=>{
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}