# Demos

## 1、CSS 实现一个扇形

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





## 2、CSS 实现一个 Tooltip

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