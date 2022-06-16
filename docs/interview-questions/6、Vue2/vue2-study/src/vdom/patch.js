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
  } else {
    // 如果标签名称不一样，直接删除老的换成新的即可
    if(oldVnode.tag !== vnode.tag) {
      // 可以通过vnode.el获取真实dom
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
    }

    // 如果标签一样，比较属性，传入新的虚拟节点和老的属性，用新的属性更新老的
    // 标签相同，直接复用之前的node节点，不需要重新创建 
    let el = vnode.el = oldVnode.el
    
    // 根据新传入的props，进行props修改
    patchProps(vnode, oldVnode.data)

    // 如果两个虚拟节点是文本节点，比较文本内容
    if(vnode.tag === undefined) { // 新老都是文本
      if(oldVnode.text !== vnode.text) {
        el.textContent = vnode.text
      }
      // 都是文本，就不需要对下面的内容了
      return
    }

    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    
    if(oldChildren.length > 0 && newChildren.length > 0) {
      // 双方都有儿子
    } else if (newChildren.length > 0) { // 只有新节点有儿子
      for(let i = 0; i < newChildren.length; i++) {
        // 创建出儿子的真实节点，然后拆入进去
        let child = createElm(newChildren[i])
        el.appendChild(child)
      }
    } else if (oldChildren.length > 0) { // 只有老节点有儿子
      // 新节点没儿子，直接清空
      el.innerHTML = ''
    }
  }
}

// 初次渲染时可以调用此方法，后续更新也可以调用此方法
function patchProps(vnode, oldProps = {}){
  let newProps = vnode.data || {}
  let el = vnode.el

  // 如果老的属性有，新的没有直接删除
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for(let key in oldStyle) {
    if(!newStyle[key]) { // 新的元素内不存在
      el.style[key] = ''
    }
  }

  for(let key in oldProps) {
    if(!newProps[key]) {
      el.removeAttribute(key)
    }
  }

  for(let key in newProps) {
    if(key === 'style') {
      for(let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else {
      vnode.el.setAttribute(key, newProps[key])
    }
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

export function createElm(vnode) {
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
    patchProps(vnode)

    children.forEach(child=>{
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}