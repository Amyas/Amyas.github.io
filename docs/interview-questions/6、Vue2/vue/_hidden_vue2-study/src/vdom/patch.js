export function patch(oldVnode, vnode) {
  if (!oldVnode) {
    return createElm(vnode); // 如果没有el，就是组件，直接根据虚拟节点返回真实节点
  }
  if (oldVnode.nodeType === 1) {
    // 真是元素，第一次更新
    // 用vnode来生成真实dom替换原来的dom元素

    const parentEl = oldVnode.parentNode;

    let elm = createElm(vnode); // 根据虚拟节点创建元素
    parentEl.insertBefore(elm, oldVnode.nextSibling);

    parentEl.removeChild(oldVnode);

    return elm;
  } else {
    // 如果标签名称不一样，直接删除老的换成新的即可
    if (oldVnode.tag !== vnode.tag) {
      // 可以通过vnode.el获取真实dom
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    }

    // 如果标签一样，比较属性，传入新的虚拟节点和老的属性，用新的属性更新老的
    // 标签相同，直接复用之前的node节点，不需要重新创建
    let el = (vnode.el = oldVnode.el);

    // 如果两个虚拟节点是文本节点，比较文本内容
    if (vnode.tag === undefined) {
      // 新老都是文本
      if (oldVnode.text !== vnode.text) {
        el.textContent = vnode.text;
      }
      // 都是文本，就不需要对下面的内容了
      return;
    }

    // 根据新传入的props，进行props修改
    patchProps(vnode, oldVnode.data);

    let oldChildren = oldVnode.children || [];
    let newChildren = vnode.children || [];

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 双方都有儿子
      // vue使用双指针处理
      patchChildren(el, oldChildren, newChildren);
    } else if (newChildren.length > 0) {
      // 只有新节点有儿子
      for (let i = 0; i < newChildren.length; i++) {
        // 创建出儿子的真实节点，然后拆入进去
        let child = createElm(newChildren[i]);
        el.appendChild(child);
      }
    } else if (oldChildren.length > 0) {
      // 只有老节点有儿子
      // 新节点没儿子，直接清空
      el.innerHTML = "";
    }

    return el;
  }
}

// 是否为同一个元素
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

  const makeIndexByKey = (children) => {
    return children.reduce((total, current, index) => {
      if (current.key) {
        total[current.key] = index;
      }
      return total;
    }, {});
  };
  const keysMap = makeIndexByKey(oldChildren);

  // 只比对同等数量的节点
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    }

    // 同时循环新的节点和老的节点
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 头部开始比较
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 尾部开始比较
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 头尾比较
      patch(oldStartVnode, newEndVnode);
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 尾头比较
      patch(oldEndVnode, newStartVnode);
      el.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else {
      // 乱序比较 核心diff
      // 1.需要根据key和对应的索引将老的内容生成映射表
      let moveIndex = keysMap[newStartVnode.key]; // 那新的去老的中查找
      if (moveIndex == undefined) {
        // 如果不能复用直接创建新的插入到老的节点开头处
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        let moveNode = oldChildren[moveIndex];
        oldChildren[moveIndex] = null; // 此节点已经被移动走了
        el.insertBefore(moveNode.el, oldStartVnode.el);
        patch(moveNode, newStartVnode);
      }
      newStartVnode = newChildren[++newStartIndex];
    }
  }

  // 如果用户追加了n个节点
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // el.appendChild(createElm(newChildren[i]))
      // insertBefore 可以直线appendChild功能

      // 看一下尾指针的下一个元素是否存在
      let anchor =
        newChildren[newEndIndex + 1] == null
          ? null
          : newChildren[newEndIndex + 1].el;
      el.insertBefore(createElm(newChildren[i]), anchor);
    }
  }

  // 用户减少了n个节点
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      // 如果老的多，将老的节点删除，但是可能存在null的情况
      if (oldChildren[i] !== null) {
        el.removeChild(oldChildren[i].el);
      }
    }
  }
}

// 初次渲染时可以调用此方法，后续更新也可以调用此方法
function patchProps(vnode, oldProps = {}) {
  let newProps = vnode.data || {};
  let el = vnode.el;

  // 如果老的属性有，新的没有直接删除
  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      // 新的元素内不存在
      el.style[key] = "";
    }
  }

  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key);
    }
  }

  for (let key in newProps) {
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else {
      vnode.el.setAttribute(key, newProps[key]);
    }
  }
}

function createComponent(vnode) {
  let i = vnode.data;
  // i = vnode.data.hook -> i = vnode.data.hook.init
  // 判断+复值
  if ((i = i.hook) && (i = i.init)) {
    i(vnode); // 调用组件的init方法
  }
  if (vnode.componentInstance) {
    // 说明子组件new 完成了，并且创建了真实dom
    return true;
  }
}

export function createElm(vnode) {
  let { tag, data, children, text, vm } = vnode;

  if (typeof tag === "string") {
    // 元素
    if (createComponent(vnode)) {
      // 返回组件对应的真实节点
      return vnode.componentInstance.$el;
    }

    vnode.el = document.createElement(tag);
    patchProps(vnode);

    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}
