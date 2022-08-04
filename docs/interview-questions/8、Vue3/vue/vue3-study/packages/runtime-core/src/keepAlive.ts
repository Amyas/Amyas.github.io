import { onMounted } from "./apiLifyCycle";
import { getCurrentInstance } from "./component";
import { ShapeFlags } from "./createVNode";
export const KeepAlive = {
  __isKeepAlive: true,
  setup(props, { slots }) {
    const keys = new Set(); // 缓存组件的key
    const cache = new Map(); // 缓存组件的映射关系

    // dom操作api都在instance.ctx.renderer上面
    const instance = getCurrentInstance();

    let pendingCatchKey = null;

    onMounted(() => {
      // vnode是虚拟节点，虚拟节点上有el，还有subtree，subtree是对应渲染的子节点
      cache.set(pendingCatchKey, instance.subTree);
    });

    return () => {
      const vnode = slots.default();

      // 不是组件就不用缓存了
      if (vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        return vnode;
      }

      const currentComponent = vnode.type;

      const key = vnode.key === null ? currentComponent : vnode.key;
      pendingCatchKey = key;

      const cacheVnode = cache.get(key);
      if (cacheVnode) {
      } else {
        keys.add(key);
      }

      return vnode;
    };
  },
};
