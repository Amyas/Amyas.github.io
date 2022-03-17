---
title: 2、JavaScript
---

## 1、Symbol，iterator 迭代器有了解吗，哪些是可迭代的

Symbol是es6中的一个基础类型，通过Symbol创建的返回值是独一无二的。

迭代器主要是提供了next方法，通过调用next返回一个object，包含value、done，最后一次done为true，其他时候为false。

done为true时还可以继续调用next，value为undefined。

Array、String、Map、Set默认提供迭代器，效果和key of一样、iterator自己也可以直接用在key of上

使用方法：

``` js
var arr = ['a', 'b',];
var eArr = arr[Symbol.iterator]();
console.log(eArr.next().value); // a
console.log(eArr.next().value); // b
for (const item of eArr) {
  console.log(item); // a、b
}

const map1 = new Map();

map1.set('0', 'foo');
map1.set(1, 'bar');

const iterator1 = map1[Symbol.iterator]();

for (const item of iterator1) {
  console.log(item); // [0, 'foo']、[1, 'bar']
}
```

## 2、用 Set 获取两个数组的交集，如何做

集合分为三类

并集(union)：属于A或属于B
交集(intersection)：属于A且属于B
差集(difference)：属于A不属于B

``` js
var a = [1,2,3]
var b = [3,4,5]

var union = [...new Set(a.concat(b))]
var intersection = [...new Set(a.filter(v=>b.includes(v)))]
var difference = [...new Set(a.concat(b).filter(v=>a.includes(v) && !b.includes(v)))]
```

## 3、ES6 语法用过哪些，都有哪些常用的特性

* let: 块级作用域，不存在变量提升，不能重复声明
* const: 声明常量，只读不能修改
* 解构赋值: 数组和对象都可以解构赋值
* 箭头函数: 箭头函数内部this指向父级作用域this，不能当作构造函数(不可以new)，不存在arguments可以使用...(reset)语法糖获取
* Symbol: 通过Symbol创建的返回值是唯一的，[也可以通过Symbol创建迭代器](./js.md#_1、symbol-iterator-迭代器有了解吗-哪些是可迭代的)
* Set: 类似数组，成员的值都是唯一的，没有重复，常用于去重
* map: 类似对象，储存key,val的键值对，key允许为非字符串，传统json的key只允许为字符串
* proxy: 对象拦截器
* promise: es6的异步解决方案
* async: generator异步的语法糖，可读性高
* class: es6定义类的方法，可以通过extends关键词进行继承

## 4、介绍一下单例模式和它在前端的应用

单例模式的核心思想是确保全局有且只有一个实例，并且提供访问的方法。

之前的例子：直播间项目，封装一个直播类，提供播放器和im相关的方法，可以在项目全局使用，并且数据是一致的。

## 5、介绍一下原型、原型链

我们首先使用构造函数创建一个对象：

``` js
function Person(){}
var person = new Person()
person.name = "amyas"
console.log(person.name) // amyas
```

在这个例子中，Person就是一个构造函数，我们使用new创建了一个实例对象person。
接下来进入正题：

### prototype

每个函数都有一个prototype属性：

``` js
function Person(){}
Person.prototype.name = "amyas"
var person1 = new Person()
var person2 = new Person()
console.log(person1.name) // amyas
console.log(person2.name) // amyas
```

函数的prototype属性指向了一个对象，这个对象正是调用该构造函数而创建的实例的原型，也就是这个例子中person1和person2的原型。

那么什么是原型呢？：每个JavaScript对象(null除外)在创建的时候就会关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型继承属性。

下图表示了构造函数和实例原型之间的关系：

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-17-12-39-20.png" alt="js2022-03-17-12-39-20" width="" height="" />

那么我们该怎么表示实例与实例原型之间的关系呢，也就是person和Person.prototype之间的关系呢？这时候我们就要讲到第二个属性：

### __proto__

这是每个JavaScript对象(除了null)都具有的一个属性，叫__proto__，这个属性会指向该实例的原型。

``` js
function Person(){}
var person = new Person()
console.log(person.__proto__ === Person.prototype) // true
```

于是我们更新下关系图：

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-17-12-43-16.png" alt="js2022-03-17-12-43-16" width="" height="" />

到这里，实例对象person和构造函数Person都可以指向原型Person.prototype，那么原型Person.prototype如何指向构造函数Person或实例person呢？

### constructor

首先原型是无法指向实例的，因为一个构造函数可以生成多个实例，但是原型是可以通过constructor属性指向构造函数。

``` js
function Person(){}
console.log(Person.prototype.constructor === Person) // true
```

于是我们继续更新关系图：

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-17-12-46-50.png" alt="js2022-03-17-12-46-50" width="" height="" />

经上我们的出以下结论：

``` js
function Person(){}
var person = new Person()
console.log(person.__proto__ === Person.prototype) // true
console.log(Person.prototype.constructor === Person) // true

// 通过该方法可以获取实例的原型，代替__proto__
console.log(Object.getPrototypeOf(person) === Person.prototype) // true
```

了解了构造函数constructor、实例原型prototype和实例之间的关系，接下来将实例和原型的关系：

### 实例与原型

当读取实例的属性时，如果找不到，就会查找实例原型上的属性，如果还找不到，就会在原型的原型中查找，直到最顶层为止（Object.prototype）。

``` js
function Person(){}
Person.prototype.name = "amyas"

var person = new Person()
person.name = "dav"
console.log(person.name) // dav

delete person.name
console.log(person.name) // amyas
```

在这个例子中，我们给实例对象person添加了name属性，当我们打印person.name的时候，结果自然为dav。
但是当我们删除了person的name属性时，读取person.name，从person对象中找不到name属性就会从person的原型person.__proto__，也就是Person.prototype中查找，幸运的是我们找到了name属性，结果为amyas，

但是万一没找到呢？就会通过__proto__依次向上查找，直接找到Object.prototype。

### 原型链

这个通过__proto__组成的链结构就是原型链，也就是下图中蓝色的这条线。

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-17-14-17-58.png" alt="js2022-03-17-14-17-58" width="400px" height="" />

## 6、介绍一下前端的继承方式

### 1、原型链继承

``` js
function Parent(){
  this.name = "amyas"
}
Parent.prototype.getName = function(){
  console.log(this.name)
}
function Child(){}
Child.prototype = new Parent()
var child1 = new Child()
console.log(child1.name) // amyas
console.log(child1.getName()) // amyas
```

**问题：**

1、引用类型的属性被所有实例共享：

``` js
function Parent(){
  this.colors = ['red','yellow']
}
function Child(){}
Child.prototype = new Parent()

var child1 = new Child()
child1.colors.push('blue')
console.log(child1.colors) // red yellow blue

var child2 = new Child()
console.log(child2.colors) // red yellow blue
```

2、在创建Child实例时，不能向Parent传参

### 2、借用构造函数

``` js
function Parent(){
  this.colors = ['red', 'yellow']
}
Parent.prototype.getName = function(){
  console.log('amyas')
}
function Child(){
  Parent.call(this)
}
var child1 = new Child()
child1.colors.push('blue')
console.log(child1.colors) // red yellow color
console.log(child1.getName()) // Uncaught TypeError: child1.getName is not a function

var child2 = new Child()
console.log(child2.colors) // red yellow
```

**优点：**

1、避免了引用类型的属性被所有实例共享
2、可以在Child中向Parent传参

``` js
function Parent(name){
  this.name = name;
}
function Child(name) {
  Parent.call(this, name);
}
var child1 = new Child('amyas');
console.log(child1.name) // amyas

var child2 = new Child('dav')
console.log(child2.name) // dav
```

**缺点：**

1、方法都在构造函数中定义，每次创建实例都会创建一遍方法，影响性能。
2、只能继承父类的实例属性和方法，不能继承原型属性和方法。

### 3、组合继承

组合上述两种方法就是组合继承。用原型链实现对原型属性和方法的继承，用借用构造函数技术来实现实例属性的继承。

``` js
function Parent(name) {
  this.name = name
  this.colors = ['red', 'yellow', 'blue']
}
Parent.prototype.getName = function(){
  console.log(this.name)
}
function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = new Parent()
Child.prototype.constructor = Child
Child.prototype.getAge = function(){
  console.log(this.age)
}

var child1 = new Child('amyas',18)
child1.colors.push('black')
console.log(child1.name) // amyas
console.log(child1.age) // 18
console.log(child1.colors) // red yellow blue black

var child2 = new Child('dav', 20)
console.log(child2.name) // dav 
console.log(child2.age) // 18
console.log(child2.colors) // red yellow blue
```

### 4、原型式继承

``` js
function createObj(o) {
  function F(){}
  F.prototype = o
  return new F()
}
```

就是Object.create的模拟实现，将传入的对象作为创建的对象原型。

**缺点：**

包含引用类型的属性值始终都会共享相应的值，这点和原型链继承一样。

``` js
var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
}

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person1';
console.log(person2.name); // kevin

person1.friends.push('taylor');
console.log(person2.friends); // ["daisy", "kelly", "taylor"]
```

注意：修改person1.name的值，person2.name的值并未发生改变，并不是因为person1和person2有独立的 name 值，而是因为person1.name = 'person1'，给person1添加了 name 值，并非修改了原型上的 name 值。

### 5、寄生式继承

创建一个仅用于封装继承过程的函数，该函数的内部以某种形式来做增强对象，最后返回对象

``` js
function createObj(obj) {
  var clone = Object.create(obj)
  clone.sayName = function(){
    console.log("hi")
  }
  return clone
}
```

**缺点：**

和借用构造函数模式一样，每次创建对象都会创建一遍方法。

### 6、寄生组合式继承

为了方便大家阅读，在这里重复一下组合继承的代码：

``` js
function Parent(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}
Parent.prototype.getName = function(){
  console.log(this.name)
}
function Child(name,age) {
  Parent.call(this, name)
  this.age = age
}
Child.prototype = new Parent()
var child1 = new Child('amyas', 18)
console.log(child1)
```

组合继承最大的缺点是会调用两次父构造函数。

一次是设置子类实例的原型的时候：

``` js
Child.prototype = new Parent()
```

一次在创建子类实例的时候：

``` js
var child1 = new Child('amyas', 18)
``` 

回想下new的模拟实现，其实这句话中，我们会执行：

``` js
Parent.call(this, name)
```

在这里，我们又会调用一次Parent构造函数。

所以，在这个例子中，如果我们打印child1对象，我们会发现Child.prototype和child1都有一个属性为colors，属性值为['red','blue','green']

那么我们该如何精益求精，避免这一次重复调用呢？

如果我们不使用Child.prototype = new Parent()，而是间接的让Child.prototype 访问到 Parent.prototype呢？

看看如何实现：

``` js
function Parent(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}
Parent.prototype.getName = function(){
  console.log(this.name)
}
function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

// 关键的三步
var F = function(){}
F.prototype = Parent.prototype
Child.prototype = new F()

var child1 = new Child('amyas', 18)
console.log(child1)
```

最后我们封装一下这个继承方法：

``` js
function object(o) {
  function F(){}
  F.prototype = o
  return new F()
}
function prototype(child, parent) {
  var prototype = object(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}

// 当我们使用的时候
prototype(Child, Parent)
```

### 7、es6类继承extends

``` js
class Parent {
  constructor(num) {
    this.num = num
  }
}
class Child extends Parent {
  constructor(){
    super(10)
  }
}
var child = new Child()
console.log(child.num) // 10
```

## 实现一个改变 this 指向的 call 方法，介绍一下原理

## 节流和防抖的原理是什么

## 事件循环介绍一下

## 0.1 + 0.2 为什么不等于 0.3，为什么会有误差，如何解决

## 大数加法如何实现

## export 和 module.exports 的区别

## 在工作中有用到什么设计模式么

## 举例一下 Map 和 object 的区别，如果需要一个字典的需求，都是 key: value 的形式，那应该怎么选择这两个呢

## Map 和 WeakMap 有什么区别

## js 垃圾回收机制有了解吗

## ES5 的继承都有哪几种，主要介绍一下组合寄生

## proxy和defineProperty的区别是什么，各自的优势和缺点是什么

## 如何理解线程和进程

## Object.create(null)和直接创建一个{}有什么区别

## new一个函数做了哪些事

## 对线上各类异常如何处理，对线上的静态资源加载失败如何捕获

## bridge原理有了解么

## js的数据类型都有哪些，有什么区别，为什么基本数据类型存到栈但是引用数据类型存到堆

## 数据类型常用的判断方式都有哪些

## 异步加载js的方式都有哪些

## 加载css和js时会阻塞dom渲染么

## get和post有什么区别

## 如果页面中有大量的DOM更新，导致页面变卡，有哪些方案可以优化

## 对闭包的理解，闭包的适用场景和缺点

## 从输入URL到页面渲染都发生了什么

## 做过唤起app么，有遇到过什么问题吗，如何判断唤起是否成功

## 小程序和H5都有哪些区别，有看过小程序底层如何实现的么
