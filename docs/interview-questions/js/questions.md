# Questions

## 1、介绍一下单例模式和它在前端的应用

单例模式的核心思想是确保全局有且只有一个实例，并且提供访问的方法。

之前的例子：直播间项目，封装一个直播类，提供播放器和im相关的方法，可以在项目全局使用，并且数据是一致的。


## 2、0.1 + 0.2 为什么不等于 0.3，为什么会有误差，如何解决

计算机是通过二进制的方式存储数据的，所以计算机在计算0.1+0.2的时候，实际上是计算两个数的二进制的和。0.1和0.2这两个数的二进制都是无限循环的。

但是在JavaScript中只有一种数字类型：Number，它是标准的double双精度浮点数。在二进制科学表示法中，双精度浮点数的小数部分最多保留52位，剩余的需要舍去，遵从“0舍1入”原则。

所以导致0.1+0.2不等与0.3

最简单的解决方法是，((0.1*10) + (0.2*10)) / 10

## 3、exports 和 module.exports、import、export 的区别

* require：node和es6都支持的导入
* import/export：只有es6支持的导入和导出
* module.exports/exports：只有node支持的导出

### Node

nodejs的模块模遵循commonjs规范

node执行一个文件时，会给这个文件内生成一个exports和module模块，而module又有一个exports属性。他们之间的关系如下：

``` js
exports = module.exports = {}
```

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-29-17-15-31.png" alt="js2022-03-29-17-15-31" width="" height="" />

接下来看下代码：

``` js
// utils.js
let a = 100
console.log(module.exports) // {}
console.log(exports) // {}

exports.a = 200
exports = '指向其他内存'

// test.js
var a = require('./utils')
console.log(a) // {a: 200}
```

从上面可以看出，require引入的是module.exports指向的内容，exports只是module.exports的引用。

### ES6

import、export 和 export default

* export和export default均用于到处常量、函数、文件、模块等。
* 在一个文件或模块中，export、import可以有多个，export default仅有一个。
* 通过export方式导出，在导入时要加{}，export default则不需要。
* export能直接导出变量表达式，export default不行。

``` js
// es6export.js
// 导出变量
export const a = '100'

// 导出方法
export const dogSay = function(){
  console.log("wang wang")
}

// 导出方法第二种
export function catSay(){
  console.log("miao miao")
}

// 导出方法第三种
export function sayTest(){
  console.log("test")
}

export {sayTest}

const m = 100
export default m

// test.js
import {dogSay, catSay} from './es6export'
import m from './es6export'
import * as testModule from './es6export'

dogSay()
catSay()
console.log(m) // 100
testModule.sayTest()
console.log(testModule.m) // undefined，因为在default属性里
console.log(testModule.default) // 100
```

## 4、js 垃圾回收机制有了解吗

一句话解释：没有被任务变量引用的数据会定期被js引擎回收

## 5、proxy和defineProperty的区别是什么，各自的优势和缺点是什么

* proxy
  * 可以监听整个对象，而defineProperty只能遍历监听属性
  * 可以直接监听数组的变化，而defineProperty不行

* defineProperty
  * 兼容性好，支持IE9，而proxy存在兼容问题。

## 6、Object.create(null)和直接创建一个{}有什么区别

* Object.create(null)
  * 这种方式创建的obj没有任何原型方法toString、hasOwnProperty等方法，比较纯粹，可以自己实现


## 7、异步加载js的方式都有哪些

defer：会让js并行下载，但是会等到html解析完成后执行，在window.onload时间之前

async：会让js并行下载，下载完后立即执行，无论html是否解析完成

ajax

``` js
var xhr = new XMLHttpRequest();
xhr.open("get", "your_file.js", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'your_file.js';
            script.text = xhr.responseText;
            // 只有添加到html文件中才会开始下载
            document.body.append(script);
        }
    }
}
xhr.send(null);
```

动态创建script：只有添加到html文件中才会开始下载

``` js
let script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'your_file.js';
// 只有添加到html文件中才会开始下载
document.body.append(script);
```

import()

## 8、加载css和js时会阻塞dom渲染么

* 加载CSS不会阻塞DOM的解析
  * 在CSS未下载完成前可以通过JS获取到DOM结构

* 加载CSS会阻塞DOM的渲染
  * 在CSS未下载完成前，DOM不会渲染

* 加载CSS会阻塞后面的JS代码执行

* 加载JS会影响影响DOM的解析、渲染（使用async或defer可以解决）

## 9、如果页面中有大量的DOM更新，导致页面变卡，有哪些方案可以优化

* 懒加载
* 分页
* 虚拟列表

虚拟列表核心就是只渲染可视区域的数据

[虚拟列表的具体实现](https://juejin.cn/post/6844903982742110216)

## 10、H5如何唤起App

* IOS、Android：直接window.location.href跳转
* 微信环境引导用户跳转到Safari浏览器
