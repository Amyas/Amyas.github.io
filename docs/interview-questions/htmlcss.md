---
title: 1、HTML、CSS
---

## 1、重绘和重排

* 重排(reflow): DOM 位置、大小发生变化时触发
  * 以下情况会触发重排:
  * 页面初始渲染，这是开销最大的一次重排
  * 添加/删除可见的 DOM 元素
  * 改变元素位置
  * 改变元素尺寸，比如边距、填充、边框、宽度和高度等
  * 改变元素内容，比如文字数量，图片大小等
  * 改变元素字体大小
  * 改变浏览器窗口尺寸，比如 resize 事件发生时
  * 激活 CSS 伪类(例如: `:hover`)
  * 设置 style 属性的值，因为通过设置 style 属性改变节点样式的话，每一次设置都会触发一个 reflow
  * 查询某些属性或者调用某些计算方法：offsetWidth、offsetHeight 除此之外，当我们调用 getComputedStyle 方法，也会触发重排，原理是一样的，都为求一个即时性、准确性。

* 重绘(Repaints): 元素外观发生变化，但是没有改变布局时触发
  * 常见引起重绘的属性:
  * color、background、border-style、visibility、border-radius


## 2、盒模型

### 基本概念

**什么是盒模型:** 盒模型包含了内容(content)、内边距(padding)、边框(border)、外边距(margin)。如图：

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/htmlcss2022-03-15-18-43-19.png" alt="htmlcss2022-03-15-18-43-19" width="" height="" />

### 标准模型和IE怪异盒模型的区别

IE怪异盒模型和标准模型的唯一区别是内容计算方式不同，如图：

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/htmlcss2022-03-15-18-44-41.png" alt="htmlcss2022-03-15-18-44-41" width="" height="" />


* **IE怪异盒模型宽度width=content+padding+border，高度计算方式相同**
* **box-sizing: border-box**

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/htmlcss2022-03-15-18-47-56.png" alt="htmlcss2022-03-15-18-47-56" width="" height="" />

* **标准盒模型宽度width=content，高度计算方式相同**
* **box-sizing: content-box**

### 获取盒模型的宽高

* `dom.style.width/height` 只能取到行内样式的宽和高，style标签中和link外链的样式取不到。
* `dom.currentStyle.width/height` 取到的是最终渲染后的宽和高，只有IE支持此属性。
* `window.getComputedStyle(dom).width/height` 同（2）但是多浏览器支持，IE9以上支持。
* `dom.getBoundingClientRect().width/height` 也是得到渲染后的宽和高，大多浏览器支持。IE9以上支持，除此外还可以取到相对于视窗的上下左右的距离


## 3、BFC

BFC(Block formatting context) 直译为**“块格式化上下文”**

BFC主要可以解决margin重叠或者叫margin塌陷的问题还有就是解决浮动的问题。

发生margin重叠后，以两个元素之间最大的margin值为准。

需要解决重叠问题，就是通过添加一下生命生成BFC：

BFC是一块独立渲染区域，CSS规定满足下列CSS声明之一的元素便会生成BFC。

* 根元素
* float的值不为none
* overflow的值不为visible
* display的值为inline-block
* position的值为absoulte或fixed

或者是给父元素添加display: flex;

## 4、animation 和 transition、transform 有什么区别

* transform(变形): 于元素旋转、缩放、移动、倾斜等效果
* transition(过度): 用于较为单一的动画
* animation(动画): 一般用于较为复杂、有中间态的动画

## 5、CSS 实现一个扇形

首先实现一个圆形

``` css
div {
  width: 0;
  height: 0;
  border-width: 100px;
  border-style: solid;
  border-color: red yellow blue green;
  border-radius: 100px;
}
```

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/htmlcss2022-03-15-16-29-33.png" width="100px" />

隐藏其他角度

``` css
div {
  width: 0;
  height: 0;
  border-width: 100px;
  border-style: solid;
  border-color: transparent transparent blue transparent;
  border-radius: 100px;
}
```

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/htmlcss2022-03-15-16-32-01.png" width="100px" />


## 6、CSS 实现一个 Tooltip

界面上有一个Button，鼠标hover上去后会在Button上方显示一个tooltip，这个tooltip有圆角，下方有一个小三角形

预期效果：

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/htmlcss2022-03-16-14-58-22.png" alt="htmlcss2022-03-16-14-58-22" width="400px" height="" />

``` html
<style>
  [tooltip] {
    position: relative;
    display: inline-block;
    margin: 20px;
    border: 1px solid #ccc;
    padding: 4px 6px;
  }
  [tooltip]::before {
    content: "";
    position: absolute;
    border-width: 4px 6px 0 6px;
    border-style: solid;
    border-color: transparent;
    border-top-color: black;
    z-index: 99;
    opacity: 0;

    top: -5px;
    left: 50%;
    transform: translateX(-50%);
  }
  [tooltip]::after {
    content: attr(tooltip);
    position: absolute;
    background-color: black;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    padding: 4px 2px;
    min-width: 80px;
    pointer-events: none;
    z-index: 99;
    opacity: 0;

    left: 50%;
    top: -5px;
    transform: translateX(-50%) translateY(-100%);
  }
  [tooltip]:hover::after,[tooltip]:hover::before {
    opacity: 1;
  }
  [tooltip][position="left"]::before {
    top: 50%;
    left: 0;
    margin-left: -9px;
    transform: translateY(-50%) rotate(-90deg);
  }
  [tooltip][position="left"]::after {
    top: 50%;
    left: 0;
    margin-left: -5px;
    transform: translateX(-100%) translateY(-50%);
  }
</style>
<div tooltip="love you">hover</div>
<div tooltip="love you" position="left">hover left</div>
```