import { instance } from "./component";

export function provide(key, value) {
  // 需要用到setup中，没有instance就说明没在setup中使用
  if (!instance) return;

  const parentProvides = instance.parent && instance.parent.provides;
  let currentProvides = instance.provides;

  // 解决这个问题
  // provide("a", 1);
  // provide("b", 2);
  // provide("c", 3);
  if (currentProvides === parentProvides) {
    // 第一次
    currentProvides = instance.provides = Object.create(parentProvides);
  }

  currentProvides[key] = value;
}

export function inject(key, defaultValue) {
  if (!instance) return;

  const provides = instance.parent?.provides;

  if (provides && key in provides) {
    return provides[key];
  }

  return defaultValue;
}
