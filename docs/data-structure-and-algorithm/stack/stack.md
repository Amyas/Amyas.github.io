---
title: 栈
---

数组是一个线性结构，并且可以在数组的任意位置插入和删除元素。
但是有时候，我们为了实现某些功能，必须对这种任意性加以限制。
栈和队列就是比较常见的受限的线性结构。

## 什么是栈

栈（stack）是一种运算受限的线性表：

- LIFO（last in first out）表示就是后进入的元素，第一个弹出栈空间。

- 其限制是仅允许在表的一端进行插入和删除运算。这一端被称为栈顶。相对的，把另一端称为栈底。

- 向一个栈插入新元素又称作进栈，入栈或压栈，它是把新元素放到栈顶元素的上面，使之成为新的栈顶元素。

- 从一个栈删除元素又称作出栈或退栈，它是把栈顶元素删除掉，使其相邻的元素称为新的栈顶元素。

如下图所示：

![stack2022-03-03-16-23-38](https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/stack2022-03-03-16-23-38.png)

栈的特点：**先进后出，后进先出**

## 程序中的栈

- 函数调用栈：A(B(C(D())))：

即A函数中调用B，B调用C，C调用D；在A执行过程中会将A压入栈，随后B执行时B也会被压入栈，函数C和D执行时也会被压入栈。所以当前栈的顺序为：A->B->C->D（栈顶）；函数D执行完成后，会被弹出栈被释放，弹出栈的顺序为D->C->B->A；

- 递归：

为什么没有停止停止条件的递归会造成栈溢出？比如函数A为递归函数，不断的调用自己（因为函数没有执行完，不会把函数弹出栈），不行地把相同的函数A压入栈，最后造成栈溢出（Queue Overfloat）。

## 练习

题目：有6个元素：6，5，4，3，2，1。按顺序入栈，问下列哪一个不是合法的出栈顺序？

- A：5，4，3，6，1，2

- B：4，5，3，2，1，6

- C：3，4，6，5，2，1

- D：2，3，4，1，5，6

::: tip 
题目所说的按顺序入栈指的不是一次性全部入栈，而是有进有出，进栈顺序为6->5->4->3->2->1。
:::

解析

- A答案：65入栈，5出栈，4进栈出栈，3进栈出栈，6出栈，21进栈，1出栈，2出栈（整体入栈顺序符合654321）。

- B答案：654入栈，4出栈，5出栈，3入栈出栈，2入栈出栈，1入栈出栈，6出栈（整体入栈顺序符合654321）。

- C答案：6543入栈，3出栈，4出栈，之后应该5出栈而不是6，所以错误。

- D答案：65432入栈，2出栈，3出栈，4出栈，1入栈出栈，5出栈，6出栈（整体入栈顺序符合654321）。

## 栈结构实现

### 栈的常见操作

- `push()` 添加一个新元素到栈顶位置。

- `pop()` 移除栈顶元素，同时返回被移除的元素。

- `peek()` 返回栈顶的元素，不对栈做任何修改。

- `isEmpty()` 如何栈里没有任何元素就返回`true`，否则返回`false`。

- `size()` 返回栈里的个数。这个方法和数组的`length`属性类似。

- `toString` 将栈结构的内容以字符串的形式返回。

### JavaScript代码实现栈结构

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
```

### 测试封装的栈结构

``` js
var stack = new Stack();

// push() 测试
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.items); //--> [1, 2, 3]

// pop() 测试
console.log(stack.pop()); //--> 3

// peek() 测试
console.log(stack.peek()); //--> 2

// isEmpty() 测试
console.log(stack.isEmpty()); //--> false

// size() 测试
console.log(stack.size()); //--> 2

// toString() 测试
console.log(stack.toString()); //--> 1 2
```

## 十进制转二进制

利用栈结构的特点封装实现十进制转换为二进制的方法。

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
console.log(dec2bin(100)); //--> 1100100
```