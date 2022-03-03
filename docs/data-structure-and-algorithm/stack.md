---
title: 栈
---

## 实现一个栈

``` js
// 封装栈类
function Stack() {
  // 栈中的属性
  this.items = [];

  // 栈的相关操作
  // 1、将元素压入栈
  Stack.prototype.push = function (element) {
    this.items.push(element);
  };

  // 2、从栈中取出元素
  Stack.prototype.pop = function () {
    return this.items.pop();
  };

  // 3、查看一下栈顶元素
  Stack.prototype.peek = function () {
    return this.items[this.items.length - 1];
  };

  // 4、判断栈是否为空
  Stack.prototype.isEmpty = function () {
    return this.items.length === 0;
  };

  // 5、获取栈中元素的个数
  Stack.prototype.size = function () {
    return this.items.length;
  };

  // 6、toString方法
  Stack.prototype.toString = function () {
    var resultString = "";
    for (var i = 0; i < this.items.length; i++) {
      resultString += this.items[i] + " ";
    }
    return resultString;
  };
}

// 栈的使用
var s = new Stack();
s.push(20);
s.push(10);
s.push(100);
s.push(77);
s.pop();
console.log(s);
```

## 十进制转二进制

``` js

// 十进制转换成二进制
function dec2bin(decNumber) {
  // 1.定义一个栈对象
  var stack = new Stack();

  // 2.循环操作
  while (decNumber > 0) {
    // 2.1. 获取余数，并放入栈中
    stack.push(decNumber % 2);

    // 2.2. 获取整除后的结果，作为下一次运行的数组
    decNumber = Math.floor(decNumber / 2);
  }

  // 3.从栈中取出0和1
  var binaryString = "";
  while (!stack.isEmpty()) {
    binaryString += stack.pop();
  }

  return binaryString;
}

// 测试十进制转二进制
console.log(dec2bin(100));
```