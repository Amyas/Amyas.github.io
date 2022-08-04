import { onMounted, onUpdated } from "./apiLifyCycle";
import { getCurrentInstance } from "./component";
import { ShapeFlags } from "./createVNode";
export const KeepAlive = {
  __isKeepAlive: true,
  props: {
    max: {},
  },
  setup(props, { slots }) {
    const keys = new Set(); // 缓存组件的key
    const cache = new Map(); // 缓存组件的映射关系

    // dom操作api都在instance.ctx.renderer上面
    const instance = getCurrentInstance();

    const { createElement, move, unmount } = instance.ctx.renderer;
    const storageContainer = createElement("div");
    // 组件渲染
    instance.ctx.active = (n2, container, anchor) => {
      move(n2, container, anchor);
    };

    // 组件卸载，组件卸载的时候，会将对应的节点移动到容器中
    instance.ctx.deactivate = (n1) => {
      move(n1, storageContainer);
    };

    let pendingCatchKey = null;

    const onCacheVnode = () => {
      // vnode是虚拟节点，虚拟节点上有el，还有subtree，subtree是对应渲染的子节点
      cache.set(pendingCatchKey, instance.subTree);
    };

    onMounted(onCacheVnode);
    onUpdated(onCacheVnode);

    const pruneCacheEntry = (vnode) => {
      const subTree = cache.get(vnode);
      resetFlg(subTree); // 移除keep-alive标记
      unmount(subTree);
      cache.delete(vnode);
      keys.delete(vnode);
    };

    const resetFlg = (vnode) => {
      if (vnode.shapeFlags & ShapeFlags.COMPONENT_KEPT_ALIVE) {
        vnode.shapeFlags -= ShapeFlags.COMPONENT_KEPT_ALIVE;
      }
      if (vnode.shapeFlags & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
        vnode.shapeFlags -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
      }
    };

    return () => {
      const vnode = slots.default();

      // 不是组件就不用缓存了
      if (!(vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT)) {
        return vnode;
      }

      const currentComponent = vnode.type;

      const key = vnode.key === null ? currentComponent : vnode.key;
      pendingCatchKey = key;

      const cacheVnode = cache.get(key);
      if (cacheVnode) {
        vnode.component = cacheVnode.component; // 复用组件

        // 组件应该走缓存，不要初始化用
        vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.COMPONENT_KEPT_ALIVE; // 将组件标记成keep-alive组件
      } else {
        keys.add(key);

        // LRU算法
        if (props.max && keys.size > props.max) {
          pruneCacheEntry(keys.values().next().value);
        }
      }

      // 组件应该被缓存，卸载的时候使用
      vnode.shapeFlags =
        vnode.shapeFlags | ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;

      return vnode;
    };
  },
};
