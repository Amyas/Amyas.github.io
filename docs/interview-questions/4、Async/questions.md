---
title: Questions
---

## 实现 Promise.all

``` js
Promise.all = function(promises) {
  const arr = []

  return new Promise((resolve, reject)=>{
    for(let i = 0; i < primises.length; i++) {
      promises[i].then(data=>{
        arr[i] = data
        if(i === promises.length) {
          resolve(arr)
        }
      },reject)
    }
  })
}
```

## 如何限制 Promise 请求并发数

``` js
function asynclimit(arr, limit) {
  var index = 0
  var results = []
  
  function loop(){
    const promises = arr.slice(index, index + limit)
    return Promise.all(promises).then(data=>{
      results = results.concat(data)
      index += limit

      if(index > arr.length) {
        return results
      } else {
        return loop()
      }
    })
  }

  return new Promise((resolve, reject)=>{
    loop().then(data=>{
      resolve(data)
    }, reject)
  })
}

function createRequest(val){
  const time = Math.random()
  return new Promise((resolve)=>{
    setTimeout(() => {
      resolve(val)
    }, time);
  })
}


asynclimit([
  createRequest(1),createRequest(2),
  createRequest(3),createRequest(4),
  createRequest(5),createRequest(6),
  createRequest(7)
],2).then(data=>{
  console.log(data)
})
```

## 实现一个 node 异步函数的 promisify

``` js
function promisify(fn) {
  return function(...args){
    return new Promise((resolve, reject)=>{
      function callback(err, result){
        if(err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
      args.push(callback)
      fn.apply(null, args)
    })
  }
}
```

## await和promise的关系，分别的应用场景有哪些


await

可以像同步一样写代码

可以try catch

更简洁