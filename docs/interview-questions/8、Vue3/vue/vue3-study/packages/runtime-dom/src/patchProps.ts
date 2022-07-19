import { patchClass, patchEvent, patchStyle } from "./patch-prop";

// 给属性打补丁 {style:{color: 'red'}} -> {style:{color: 'red', fontSize: 12}}
// 类名
// 行内样式
// 事件
// 其他属性
export const patchProp = (el, key, preValue, nextValue) => {
  if (key === "class") {
    patchClass(el, nextValue);
  } else if (key === "style") {
    patchStyle(el, preValue, nextValue);
  } else if (/on[^a-z]/.test(key)) {
    patchEvent(el, key, nextValue);
  }
};
