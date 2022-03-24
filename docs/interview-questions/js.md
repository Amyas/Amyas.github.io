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

## 7、call、apply、bind、new的实现

### call

call(this, arg1, arg2, ...)

改变函数this指向，可传递若干参数，立即执行

``` js
var foo = {
  value: 1
}
function bar(arg1,arg2){
  console.log(this.value,arg1,arg2)
}
bar.call(foo, 2, 3) // 1,2,3
```

**注意两点：**

1. call改变了this的指向，指向了foo
2. bar函数执行了

#### 模拟实现第一步

那么我们该怎么模拟实现这两个效果呢？

试想当调用call的时候，把foo对象改造成如下效果：

``` js
var foo = {
  value: 1,
  bar: function(arg1, arg2){
    console.log(this.value, arg1, arg2)
  }
}
foo.bar(2,3) // 1,2,3
```

这个时候this就指向了foo，是不是很简单呢？

但是这样却给foo对象本身添加了一个属性，这可不是我们想要的！

不过也不用担心，我们用delete再删除它不就好了～

所以我们模拟的步骤可以分为：

1. 将函数设为对象的属性
2. 执行该函数
3. 删除该函数

``` js
// 1
foo.fn = bar
// 2
foo.fn()
// 3
delete foo.fn()
```

fn是对象的属性名， 反正最后也要删除它，所以起成什么都无所谓。

根据这个思路，我们可以尝试去写第一版的call函数：

``` js
Function.prototype.call2 = function(context) {
  context.fn = this
  context.fn()
  delete context.fn()
}

var foo = {
  value: 1
}

function bar(){
  console.log(this.value)
}

bar.call2(foo) // 1
```

第一步搞定，接下来实现参数传递

#### 模拟实现第二步

由于传入的参数不固定，我们从Arguments对象中取值，取出第二个到最后一个参数，放到一个数组中。

``` js
// 加入传入的参数如下
// arguments = {
//   0: foo,
//   1: 1,
//   2: 2,
//   length: 3
// }

// 因为arguments是类数组对象，所以可以使用for循环
var args = []
for(var i = 1; i < arguments.length; i++) {
  args.push('arguments[' + i + ']')
}

// 此时arguments为 ['arguments[1]','arguments[2]']
```

为了兼容低版本，我们使用 eval 方法拼接成一个函数：

``` js
eval('context.fn(' + args + ')')
```

这里args会自动调用Array.toString()这个方法

所以我们的第二版代码如下：

``` js
Function.prototype.call2 = function(context) {
  context.fn = this

  var args = []
  for(var i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }

  eval('context.fn(' + args + ')')

  delete context.fn
}

var foo = {
  value: 1
}

function bar(arg1, arg2) {
  console.log(this.value, arg1, arg2)
}

bar.call(foo, 2, 3) // 1,2,3
```

#### 模拟实现第三步

到这里我们已经完成了80%，但是还有两个小点需要注意：

1. this参数可以传null，当为null的时候，默认指向window

``` js
var value = 1
function bar(){
  console.log(this.value)
}
bar.call(null) // 1
```

2. 函数是可以有返回值的

``` js
var foo = {
  value: 1
}
function bar(arg1, arg2) {
  return {
    value: this.value,
    arg1: arg1,
    arg2: arg2
  }
}
console.log(bar.call(foo, 2, 3)) // 1,2,3
```

接下来上最终版代码解决这两个问题：

``` js
Function.prototype.call2 = function(context) {
  var context = context || window
  context.fn = this

  var args = []
  for(var i = 1;i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }

  var result = eval('context.fn(' + args + ')')
  delete context.fn
  return result
}

var value = -1

var foo = {
  value: 1
}

function bar(arg1, arg2) {
  console.log(this.value)
  return {
    value: this.value,
    arg1: arg1,
    arg2: arg2
  }
}

bar.call2(null) // -1

console.log(bar.call2(foo, 2, 3))
// 1
// {
  // value: 1,
  // arg1: 2,
  // arg2: 2
// }

```

### apply

appply和call类似

apply(this, [arg1, arg2, ...])

改变函数this指向，通过数组可传递若干参数，立即执行

``` js
Function.prototype.apply2 = function(context, arr) {
  var context = context || window
  context.fn = this

  var result
  if(!arr) {
    result = context.fn()
  } else {
    var args = []
    for(var i = 0;i< arr.length; i++){
      args.push('arr[' + i + ']')
    }
    result = eval('context.fn(' + args + ')')
  }

  delete context.fn
  return result
}
```

### bind

bind(this, [arg1, arg2, ...])

改变函数this指向，通过数组可传递若干参数，不立即执行而是返回一个函数

#### 返回函数的模拟实现

先举个例子：

``` js
var foo = {
  value: 1
}
function bar(){
  console.log(this.value)
}
var bindFoo = bar.bind(foo)
bindFoo() // 1
```

接下来基于call或apply实现

``` js
Function.prototype.bin2 = function(context){
  var self = this
  return function() {
    return self.apply(context)
  }
}
```

之所以`return self.apply(context)`是考虑到绑定函数可能有返回值

``` js
var foo = {
    value: 1
};

function bar() {
	return this.value;
}

var bindFoo = bar.bind(foo);

console.log(bindFoo()); // 1
```

#### 传参的模拟实现

接下来是第二点，可以传入参数：

``` js
var foo = {
  value: 1
};

function bar(name, age) {
  console.log(this.value);
  console.log(name);
  console.log(age);
}

var bindFoo = bar.bind(foo, 'daisy');
bindFoo('18');
// 1
// daisy
// 18
```

函数需要传name和age两个参数，并且还可以在bind的时候，只传一个name，在执行返回函数的时候，再传另一个参数age！

我们可以通过arguments进行处理：

``` js
Function.prototype.bind2 = function(context) {
  var self = this
  // 通过bind函数获取第二个参数到最后一个参数
  var args = Array.prototype.slice.call(arguments, 1)

  return function(){
    // 这个时候的arguments是指bind返回的函数传入的参数return function()这个作用域
    var bindArgs = Array.prototype.slice.call(arguments)
    return self.apply(context, args.concat(bindArgs))
  }
}
```

#### 构造函数效果的模拟实现

完成了上面的两点，最难的部分到了！因为bind还有一个特性就是：

**一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器，提供的this值被忽略，同时调用时的参数被提供给模拟函数**

也就是说当bind返回的函数作为构造函数时，bind时指定的this值会失效，但传入的参数依然生效。

``` js
Function.prototype.bind2 = function(context) {
  var self = this
  var args = Array.prototype.slice.call(arguments, 1)

  return fBound = function(){
    var bindArgs = Array.prototype.slice.call(arguments)

    return self.apply(
      this instanceof fBound ? this : context,
      args.concat(bindArgs)
    )
  }

  fBound.prototype = this.prototype
  return fBound
}
```

但是在这个写法中，我们直接将fBound.prototype = this.prototype，我们直接修改fBound.prototype的时候，也会直接修改绑定函数的prototype，这个时候我们通过一个空函数来中转

``` js
Function.prototype.bind2 = function(context) {
  var self = this
  var args = Array.prototype.slice.call(arguments, 1)

  var fNOP = function(){}

  return fBound = function(){
    var bindArgs = Array.prototype.slice.call(arguments)

    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    )
  }

  fNOP.prototype = this.prototype
  fBound.prototype = new fNOP()
  return fBound
}
```

### new

new就是把一个构造函数变成实例对象，可以访问构造函数里的属性，也可以访问到构造函数原型prototype上的属性

因为new是关键字，无法像bind函数一样直接覆盖，所以我们写一个函数，，命名为objectFactory，来模拟new的实现：

``` js
function Person(){}
// 使用new
var person = new Person()
// 使用 objectFactory
var person = objectFactory(Person)
```

因为new的结果是返回一个新对象，所以在模拟实现的时候，我们也要建立一个新对象，假设这个对象叫obj，因为obj会具有Person构造函数里的属性，想想经典继承的例子，我们可以使用Person.apply(obj, arguments)来给obj添加新的属性。

实例的__proto__属性会指向构造函数的prototype，也正是因为建立起这样的关系，实例可以访问原型上的属性。

#### 第一版实现

现在我们可以尝试写第一版：

``` js
function objectFactory(){
  var obj = new Object()
  var Constructor = [].shift.call(arguments)

  obj.__proto__ = Constructor.prototype

  Constructor.apply(obj, arguments)

  return obj
}
```

在这一版中，我们：

1. 用new Object()的方式新建了一个对象obj
2. 取出第一个参数，就是我们要传入的构造函数，此外因为shift会修改原数组，所以arguments会被去除第一个参数
3. 将obj的原型指向构造函数，这样obj就可以访问到构造函数原型中的属性
4. 使用apply改变构造函数this指向obj，这样obj就可以访问到构造函数中的属性
5. 返回obj

接下来测试一下：

``` js
function Person(name, age) {
  this.name = name
  this.age = age
  this.habit = 'games'
}
Person.prototype.color = 'red'
Person.prototype.getName = function(){
  console.log(this.name)
}
function objectFactory(){
  var obj = new Object()
  var Constructor = [].shift.call(arguments)

  obj.__proto__ = Constructor.prototype
  Constructor.apply(obj, arguments)

  return obj
}

var person = objectFactory(Person, 'amyas', 18)

console.log(person.name)
console.log(person.habit)
console.log(person.color)
person.getName()
```

#### 返回值效果实现

1. 如果构造函数的返回值是一个对象，那么实例只能访问返回对象的属性
2. 如果不是一个对象，那就相当于没有返回值

``` js
// 1
function Otaku (name, age) {
    this.strength = 60;
    this.age = age;

    return {
        name: name,
        habit: 'Games'
    }
}

var person = new Otaku('Kevin', '18');

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // undefined
console.log(person.age) // undefined


// 2
function Otaku (name, age) {
    this.strength = 60;
    this.age = age;

    return 'handsome boy';
}

var person = new Otaku('Kevin', '18');

console.log(person.name) // undefined
console.log(person.habit) // undefined
console.log(person.strength) // 60
console.log(person.age) // 18
```

接下来看最终实现：

``` js
function objectFactory(){
  var obj = new Object()
  var Constructor = [].shift.call(arguments)

  obj.__proto__ = Constructor.prototype
  var ret = Constructor.apply(obj, arguments)

  return typeof ret === 'object' ? ret : obj
}
```

## 8、节流和防抖的原理是什么

### 防抖

在前端开发中会遇到一些频繁的事件触发，比如：

1. window的resize、scroll
2. mousedown、mousemove
3. keyup、keydown

为此，我们举个例子来了解事件是如何频繁出发的：

``` html
<!DOCTYPE html>
<html lang="zh-cmn-Hans">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1">
    <title>debounce</title>
    <style>
        #container{
            width: 100%; height: 200px; line-height: 200px; text-align: center; color: #fff; background-color: #444; font-size: 30px;
        }
    </style>
</head>

<body>
    <div id="container"></div>
    <script>
      var count = 1;
      var container = document.getElementById('container');

      function getUserAction() {
          container.innerHTML = count++;
      };

      container.onmousemove = getUserAction;
    </script>
</body>

</html>
```

我们来看下效果

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-21-15-06-57.gif" alt="js2022-03-21-15-06-57" width="" height="" />

从左边滑到右边就触发了165次getUserAction函数！

因为这个例子很简单，所以浏览器完全能反应过来，可是如果是复杂的回调函数或者ajax请求呢？假设1秒触发60次，每个回调就必须在1000 / 60 = 16.ms内完成，否则就会出现卡顿。

为了解决这个问题，一边有两种解决方案：

1. debounce 防抖
2. throttle 节流

今天主讲防抖的实现。

**防抖的原理就是：触发事件后n秒内如果继续触发该事件，则重置之前的事件，如果n秒内没有事件触发，在n秒后执行事件。**

**总的说就是只执行最后一次**

#### 第一版

``` js
function debounce(func, wait) {
  var timeout
  return function(){
    clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}
```

如果我们要使用它，以最一开始的例子为例：

``` js
container.onmousemove = debounce(getUserAction, 1000)
```

现在随你怎么移动，反正你移动完 1000ms 内不再触发，我才执行事件。看看使用效果：

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-21-15-07-18.gif" alt="js2022-03-21-15-07-18" width="" height="" />

顿时就从 165 次降低成了 1 次!我们接着完善它。

#### this问题

如果我们在`getUserAction`函数汇总`console.log(this)`，在不使用`debounce`函数的时候，`this`的值为：

`` html
<div id="container"></div>
```

但是如果使用我们的`debounce`函数，`this`就会指向`Window`对象。

所以我们需要讲`this`指向正确的对象。

我们修改下代码：

``` js
function debounce(func, wait) {
  var timeout
  return function(){
    var context = this
    clearTimeout(timeout)
    timeout = setTimeout(function(){
      func.apply(context)
    }, wait)
  }
}
```

现在`this`已经可以正确指向了，让我们看下个问题：

#### event对象

`JavaScript`在事件处理函数中会提供事件对象`event`，我们修改下`getUserAction`函数：

``` js
function getUserAction(e){
  console.log(e)
  container.innerHTML = count++
}
```

如果我们不使用`debounce`函数，这里会打印`MouseEvent`对象

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-18-18-56-16.png" alt="js2022-03-18-18-56-16" width="" height="" />

但是在我们实现的`debounce`函数，却只会打印`undefined`

所以我们在修改一下代码：

``` js
function debounce(func, wait) {
  var timeout
  return function(){
    var context = this
    var args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function(){
      func.apply(context, args)
    }, wait)
  }
}
```

到此为止，我们修复了两个问题：

1. `this`指向
2. `event`对象

#### 实现立即执行

这个时候，代码已经很完善了，但是为了让这个函数更加完善，我们考虑一个新需求。

这个需求是：

我不希望非要等到事件停止触发后采取执行，我希望函数立即执行，然后等到停止触发n秒后，才可以重新触发执行。

想想这个需求也是很有道理的，那我们加个`immediate`参数判断是否是立即执行。

``` js
function debounce(func, wait, immediate) {
  var timeout
  return function(){
    var context = this
    var args = arguments

    if(timeout) clearTimeout(timeout)
    if(immediate && !timer) {
      func.apply(context, args)
    } else {
      timeout = setTimeout(function(){
        func.apply(context, args)
      }, wait)
    }
  }
}
```

再来看看使用效果：

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-21-15-07-48.gif" alt="js2022-03-21-15-07-48" width="" height="" />

### 节流

节流的原理很简单：

如果你持续触发事件，每隔一段时间，只执行一次事件。

根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所变动。

我们用`leading`代表首次是否执行，`trailing`代表结束后是否再执行一次。

关于节流的实现，有两种主流实现方式，一种是使用时间戳，一种是设置定时器。

#### 使用时间戳

让我们来看第一种方法：使用时间戳，当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳（最开始值为0），如果大于设置的事件周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。

``` js
function throttle(func, wait) {
  var context;
  var args;
  var previous = 0;

  return function() {
    var now = +new Date()
    context = this;
    args = arguments;

    if(now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  }
}
```

例子依然是用讲`debounce`中的例子，如果你要使用：

``` js
container.onmousemove = throttle(getUserAction, 1000)
```

效果演示如下：

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-22-12-06-47.gif" alt="js2022-03-22-12-06-47" width="" height="" />

我们可以看到：当鼠标移入的时候，事件立刻执行，每过1s会执行一次，如果在4.2s停止触发，以后不会再执行事件。

#### 使用定时器

接下来，我们讲讲第二种实现方式，使用定时器。

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，晴空定时器，这样就可以设置下个定时器。

``` js
function throttle(func, wait) {
  var timeout;
  var previous = 0;

  return function(){
    context = this;
    args = arguments;

    if(!timeout) {
      timeout = setTimeout(function(){
        timeout = null;
        func.apply(context, args)
      }, wait)
    }
  }
}
```

为了让效果明显，我们设置wait事件为3s，演示效果如下：

<img src="https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/js2022-03-22-12-10-25.gif" alt="js2022-03-22-12-10-25" width="" height="" />

我们可以看到：当鼠标移入的时候，事件不会立刻执行，晃了3s后终于执行了一次，此后每3s执行一次，当数字显示为3的时候，立刻移除鼠标，相当于大约9.2s的时候停止触发，但是依然会在第12s的时候执行一次事件。

所以比较两个方法：

1. 第一种事件会立即执行，第二种会在n秒后第一次执行。
2. 第一种事件停止触发后没有办法再次执行事件，第二种事件停止触发后依然会再执行一次事件。


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

## jsBridge原理有了解么

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

