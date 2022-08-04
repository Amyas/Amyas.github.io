import { instance, setCurrentInstance } from "./component";

export const enum LifyCycle {
  BEFORE_MOUNT = "bm",
  MOUNT = "m",
  UPDATE = "u",
}

function createInvoker(type) {
  return function (hook, currentInstance = instance) {
    if (currentInstance) {
      const lifeCycles = currentInstance[type] || (currentInstance[type] = []);
      const warpHook = () => {
        // 解决hook 回调拿不到instance的情况
        setCurrentInstance(currentInstance);
        hook.call(currentInstance);
        setCurrentInstance(null);
      };
      lifeCycles.push(warpHook);
    }
  };
}

export const onBeforeMount = createInvoker(LifyCycle.BEFORE_MOUNT);
export const onMounted = createInvoker(LifyCycle.MOUNT);
export const onUpdated = createInvoker(LifyCycle.UPDATE);
