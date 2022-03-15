---
title: 5、See Code Say Why
---

## 输出内容，为什么？

``` js
var a = { name: "Sam" };
var b = { name: "Tom" };
var o = {};
o[a] = 1;
o[b] = 2;
console.log(o[a]);
```

## 输出内容

``` js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
setTimeout(() => {
  console.log("setTimeout");
}, 0);
async1();
new Promise((resolve) => {
  console.log("promise1");
  resolve();
}).then(() => {
  console.log("promise2");
});
console.log("script end");
```

## 输出内容

``` js
const promise1 = Promise.resolve("First");
const promise2 = Promise.resolve("Second");
const promise3 = Promise.reject("Third");
const promise4 = Promise.resolve("Fourth");
const runPromises = async () => {
  const res1 = await Promise.all([promise1, promise2]);
  const res2 = await Promise.all([promise3, promise4]);
  return [res1, res2];
};
runPromises()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
```

## 输出内容

``` js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
    throw new Error();
  }, 2000);
});
const p2 = p1
  .then((val) => {
    console.log(val);
    return val + 1;
  })
  .catch((err) => {
    console.log(err);
    return err;
  });
Promise.all([p2, Promise.reject(3)])
  .then((val2) => {
    console.log(val2);
  })
  .catch((err2) => {
    console.log(err2);
  });
```

## 下面这个的输出是什么，this 指向谁

``` js
class A {
  constructor() {
    console.log(this.name);
  }
}
class B extends A {
  constructor() {
    super();
    this.name = "B";
  }
}
const b = new B();
```

## 输出，原因，解释一下调用栈和作用域链的关系

``` js
let a = 3;
function func(a) {
  a = 10;
  console.log(a);
}
func();
console.log(a);
```

## 问输出，解释一下函数调用栈和作用域链的关系

``` js
function bar() {
    console.log(project);
}

function foo() {
    var project = 'foo';
    bar();
}

var project = 'global';
foo();
```

## 问输出，如果希望循环中输出123，有哪些方式可以改

``` js
for(var i = 0; i < 3; i++){
    setTimeout(() => {
        console.log(new Date, i);
    }, 1000);
}

console.log(new Date,i);
```