# Questions

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



## 3、举例一下 Map 和 object 的区别，如果需要一个字典的需求，都是 key: value 的形式，那应该怎么选择这两个呢

object本质上是哈希结构的键值对的集合，它只能用字符串，数字，或者symbol等简单数据类型当作键，这就带来了很大的限制。

比如我想讲dom节点作为键，但是由于对象只接受字符串作为键名，虽哦咦键被自动转为字符串[object HTMLDivElement]，这显然不是我们想要的。

通过map就可实现，如下：

``` js
let DOM = document.getElementById('main')
let m = new Map()
m.set(DOM, 'hello world')
console.log(m)
console.log(m.get(DOM))
```

二者的区别主要有以下几点：

### 同名碰撞

我们知道，对象其实就是在堆开辟一块内存，其实map的键村的就是这块内存的地址。只要地址不一样，就是两个不同的键，这就解决了同名属性的碰撞问题。而传统的object显然做不到这一点。

``` js
let m = new Map()

m.set({}, 1)
m.set({}, 2)
m.set({}, 3) // 每次都是开辟新的堆内存作为键
m.set(1, 1)
m.set(1, 2) // 数字会直接顶替
m.set('1', 1)
m.set('1', 2) // 字符串相同也会顶替，但是不会顶替数字1
console.log(m) // Map {{}=>1, {}=>2, {}=>3, 1=>2, '1'=>2}
```

### 可迭代

``` js
// new Map([iterable])

let DOM = document.getElementById('main')
let m = new Map()
m.set(DOM, 'hello world') // dom
m.set(['username'], 'amyas') // 数组
m.set(true, 1) // boolean

for(let val of m) {
  console.log(val[0]) // key
  console.log(val[1])
}
```

### 长度

map可以直接拿到长度，而object不行

``` js
let m = new Map()
m.set({a:1}, 'hello world')
m.set(['username'], 'amyas')
m.set(true, 1)
console.log(m.size)
```

object 可以只用 Object.keys(obj).length 方式拿到

### 有序性

填入map的元素，会保持原有的顺序，而object无法做到。

``` js
let cont = document.getElementById('cont')
let m = new Map()
m.set(cont, 'hello,world')//dom对象作为键
m.set(['username'],'jack')//数组作为键
m.set(true,1)//boolean类型作为键
//可以保持原有顺序打印
for(let [key,value] of m){
    console.log(key) // cont ['username'] true
}

let obj = new Object()
obj['jack'] =  1
obj[0] = 2
obj[5] = 3
obj['tom'] = 4
//填入Object的元素key是自动按照字符串排序的，数字排在前面
for(let k in obj){
    console.log(k) // 0 5 jack tom
}
```

### 可展开

map可以使用省略号语法展开，而object不行

``` js
let m = new Map()
m.set({a:1}, 'hello,world')//dom对象作为键
m.set(['username'],'jack')//数组作为键
m.set(true,1)//boolean类型作为键

console.log([...m])//可以展开为二维数组 [[key, val], [key, val]]

let obj = new Object()
obj['jack'] =  1
obj[0] = 2
obj[5] = 3
obj['tom'] = 4
console.log([...obj])//TypeError: obj is not iterable
```

## 4、Map 和 WeakMap 有什么区别

weakmap只接受对象（null除外）作为key，不接受其他类型（会报错）
weakmap的key的val是弱引用，不会影响垃圾回收。

