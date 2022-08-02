import { invokerFns, isNumber, isString } from "@vue/shared";
import { createVNode, isSameVNode, ShapeFlags, Text } from "./createVNode";
import { createComponentInstance, setupComponent } from "./component";
import { ReactiveEffect } from "@vue/reactivity";
import { queueJob } from "./scheduler";

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

  function patchProps(oldProps, newProps, el) {
    if (oldProps === null) oldProps = {};
    if (newProps === null) newProps = {};

    // 循环新的覆盖老的
    for (let key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }

    // 老的有的新的没有要删除
    for (let key in oldProps) {
      if (newProps[key] === null) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  }

  function mountElement(vnode, container, anchor) {
    const { type, props, children, shapeFlags } = vnode;

    // 因为我们后续需要对比虚拟节点的差异更新页面，所以需要保留对应的真实节点
    const el = (vnode.el = hostCreateElement(type));

    if (props) {
      patchProps(null, props, el);
    }

    // children 不是数组就是文本
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children);
    }
    if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    }

    hostInsert(el, container, anchor);
  }

  function processText(n1, n2, container) {
    if (n1 === null) {
      hostInsert((n2.el = hostCreateTextNode(n2.children)), container);
    }
  }

  function processElement(n1, n2, container, anchor) {
    if (n1 === null) {
      mountElement(n2, container, anchor);
    } else {
      // 比较元素
      patchElement(n1, n2);
    }
  }

  function patchElement(n1, n2) {
    // n1 和 n2 能复用，说明dom节点不用删除
    const el = (n2.el = n1.el);
    const oldProps = n1.props;
    const newProps = n2.props;

    patchProps(oldProps, newProps, el);

    // 自己比较完，比较儿子
    patchChildren(n1, n2, el);
  }

  function unmountChildren(children) {
    children.forEach((child) => {
      unmount(child);
    });
  }

  function patchChildren(n1, n2, el) {
    const c1 = n1.children;
    const c2 = n2.children;

    const prevShapeFlag = n1.shapeFlags;
    const shapeFlag = n2.shapeFlags;

    // 开始比较儿子的情况
    /*
    新    老
    1.文本  数组  删除儿子、设置文本内容
    2.文本  文本  更新文本
    3.文本  空    更新文本
    4.数组  数组  diff算法
    5.数组  文本  清空文本，进行挂载
    6.数组  空    进行挂载
    7.空    数组  删除所有儿子
    8.空    文本  清空文本
    9.空    空    无需处理
    */

    // 1.文本  数组  删除儿子、设置文本内容
    // 2.文本  文本  更新文本
    // 3.文本  空    更新文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1.文本  数组  删除儿子、设置文本内容
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(el, c2);
      }
    } else {
      // 要么是空要么是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 之前是数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 4.数组  数组  diff算法
          patchKeyedChildren(c1, c2, el);
        } else {
          // 7.空    数组  删除所有儿子
          unmountChildren(c1);
        }
      } else {
        // 5.数组  文本  清空文本，进行挂载
        // 6.数组  空    进行挂载
        // 8.空    文本  清空文本
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, "");
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el);
        }
      }
    }
  }

  function patchKeyedChildren(c1, c2, el) {
    // 比较c1和c2两个数组之间的差异，再去更新el
    // 尽量复用节点，而且找到变化的位置
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;

    // 有任何一方比对完成后，就无需再次比对，头开始sync from start
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      i++;
    }

    // 有任何一方比对完成后，就无需再次比对，尾开始sync from end
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    // 向前追加、向后追加 + 前删除、后删除

    // 新的多、老的少
    // 当i < e1 说明老的全部比对完成
    // 1 到 e2之间的内容就是要新增的
    if (i > e1) {
      if (i <= e2) {
        while (i <= e2) {
          const nextPos = e2 + 1;
          // 看一下，下一项是否在数组内，如果在数组内，看下是否有参照物
          const anchor = c2.length <= nextPos ? null : c2[nextPos].el;
          patch(null, c2[i], el, anchor); // 插入节点
          i++;
        }
      }
    } else if (i > e2) {
      // 老的多、新的少
      if (i <= e1) {
        while (i <= e1) {
          unmount(c1[i]);
          i++;
        }
      }
    }

    // 乱序
    // a b [c d e] f g
    // a b [d e q] f g

    let s1 = i; // 老的需要对比的部分
    let s2 = i; // 新的需要对比的部分
    // v2中是用新的找老的，v3使用老的找新的

    let toBePatched = e2 - s2 + 1; // 我们需要操作的次数
    const keyToNewIndexMap = new Map();
    for (let i = s2; i <= e2; i++) {
      keyToNewIndexMap.set(c2[i].key, i);
    }

    for (let i = s1; i <= e1; i++) {
      const oldVNode = c1[i];
      // 用老的去找，看看新的里面有没有
      const newIndex = keyToNewIndexMap.get(oldVNode.key);

      if (!newIndex) {
        unmount(oldVNode); // 新的里面找不到，直接移除
      } else {
        patch(oldVNode, c2[newIndex], el); // 如果新老都哦鱼，我们需要比较比较两个节点的差异，再去比较他们的儿子
      }
    }

    // 我们需要按照新的位置重新排列，并且还需要将新的元素添加上
    for (let i = toBePatched - 1; i >= 0; i--) {
      const currentIndex = s2 + i; // 找到对应的索引
      const child = c2[currentIndex];
      const anchor =
        currentIndex + 1 < c2.length ? c2[currentIndex + 1].el : null;

      // 判断是移动还是新增，如何知道child是新增的
      // 如果有el是渲染过的
      if (!child.el) {
        patch(null, child, el, anchor);
      } else {
        hostInsert(child.el, el, anchor);
      }
    }
  }

  function unmount(n1) {
    hostRemove(n1.el);
  }

  // n1 之前的节点
  // n2 现在的节点
  function patch(n1, n2, container, anchor = null) {
    // 判断标签名和对应的key如果是一样的，说明是同一个节点
    if (n1 && !isSameVNode(n1, n2)) {
      unmount(n1);
      n1 = null; // 将n1设置为null，此时会走n2的初始化重建
    }

    const { type, shapeFlags } = n2;

    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor);
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, anchor);
        }
        break;
    }
  }

  // 组件初渲染的过程
  // 1)创建实例、这里噢鱼一个代理对象回代理data、props、attrs
  // 2)给组件实例赋值，给instance属性赋值
  // 3)创建一个组件的effect运行
  // 组件更新过程
  // 1)组件的状态发生变化会触发自己effect重新执行
  // 2)属性更新，会执行updateComponent内部会比较要不要更新，如果要更新则会调用instance.update方法，在调用render之前，更新属性即可
  function processComponent(n1, n2, container, anchor) {
    if (n1 === null) {
      // 初始化
      mountComponent(n2, container, anchor);
    } else {
      // 组件更新，插槽更新，属性更新
      updateComponent(n1, n2);
    }
  }

  function shouldComponentUpdate(n1, n2) {
    // 这个props中包含attrs
    const prevProps = n1.props;
    const nextProps = n2.props;
    return hasChangeProps(prevProps, nextProps);
  }

  function updateComponent(n1, n2) {
    // 拿到之前的属性和之后的属性看下是否有变化
    const instance = (n2.component = n1.component);

    if (shouldComponentUpdate(n1, n2)) {
      instance.next = n2; //保留最新的虚拟节点
      instance.update();
    }
  }

  function updateProps(instance, prevProps, nextProps) {
    if (hasChangeProps(prevProps, nextProps)) {
      for (let key in nextProps) {
        instance.props[key] = nextProps[key];
      }
      for (let key in instance.props) {
        if (!(key in nextProps)) {
          delete instance.props;
        }
      }
    }
  }

  function hasChangeProps(prevProps, nextProps) {
    for (let key in nextProps) {
      if (nextProps[key] !== prevProps[key]) {
        return true;
      }
    }
    return false;
  }

  function mountComponent(vnode, container, anchor) {
    // 1)组件挂载前，需要产生一个组件的实例，组件的状态、组件的属性组件对应的生命周期
    // 我们需要将创建的实例保存到vnode上
    const instance = (vnode.component = createComponentInstance(vnode));
    // 2)组件的插槽，处理组件的属性，给组件的实例赋值
    setupComponent(instance);
    // 3)给组件产生一个effect，这样可以组件数据变化后重新渲染
    setupRenderEffect(instance, container, anchor);
    // 组件的优点？复用，逻辑拆分，方便维护，vue组件级更新
  }

  function setupRenderEffect(instance, container, anchor) {
    const componentUpdate = () => {
      const { render, data } = instance;
      // render函数中的this可以取到props，也可以取到data，也可以取到attr
      if (!instance.isMounted) {
        const { bm, m } = instance;
        if (bm) {
          invokerFns(bm);
        }
        // 初始化
        const subTree = render.call(instance.proxy);
        patch(null, subTree, container, anchor);
        instance.subTree = subTree;
        instance.isMounted = true;

        if (m) {
          invokerFns(m);
        }
      } else {
        // 更新逻辑
        const next = instance.next; // 表示新的虚拟节点
        if (next) {
          // 更新属性，不会导致页面重新渲染，当前effect正在执行，触发的执行和当前effect一致
          updateComponentPreRender(instance, next);
        }
        const subTree = render.call(instance.proxy);
        patch(instance.subTree, subTree, container, anchor);
        // 生命周期更新
        if (instance.u) {
          invokerFns(instance.u);
        }
        instance.subTree = subTree;
      }
    };
    const effect = new ReactiveEffect(componentUpdate, () =>
      queueJob(instance.update)
    );
    // 用户想强制更新，instance.update()
    const update = (instance.update = effect.run.bind(effect));
    update();
  }

  function updateComponentPreRender(instance, next) {
    instance.next = null;
    instance.vnode = next; // 更新
    updateProps(instance, instance.props, next.props);
  }

  function render(vnode, container) {
    if (vnode === null) {
      // 卸载元素
      if (container._vnode) {
        unmount(container._vnode);
      }
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
