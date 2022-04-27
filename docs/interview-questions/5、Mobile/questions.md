---
title: Questions
---

## 如果一个页面需要同时适配 PC 端和移动端，应该怎么做

* 使用css媒体查询适配
* 通过nginx ua发现是mobile访问就转发到mobile项目，反之亦然

## 移动端滑动穿透的问题

弹窗带有滑动效果时，body设置overflow:hidden，弹窗关闭取消bodyo的overflow设置

``` js
handleConfirm: () => {
  document.body.style.overflow = ''
},
handleCancel () {
  document.body.style.overflow = ''
}
```