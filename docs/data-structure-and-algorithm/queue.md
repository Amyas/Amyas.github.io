---
title: 队列
---

## 实现队列

``` js
function Queue() {
  // 属性
  this.items = [];

  // 方法
  // 1.将元素加入到队列中
  Queue.prototype.enqueue = function (element) {
    this.items.push(element);
  };

  // 2.从队列中删除前端元素
  Queue.prototype.dequeue = function () {
    return this.items.shift();
  };

  // 3.查看前端元素
  Queue.prototype.front = function () {
    return this.items[0];
  };

  // 4.查看队列是否为空
  Queue.prototype.isEmpty = function () {
    return this.items.length === 0;
  };

  // 5.产看队列中元素的个数
  Queue.prototype.size = function () {
    return this.items.length;
  };
}

// 使用队列
var queue = new Queue();
// 将元素加入到队列中
queue.enqueue("a");
queue.enqueue("b");
queue.enqueue("c");
console.log(queue);

// 从队列中删除元素
queue.dequeue();
console.log(queue);

console.log(queue.front());
console.log(queue.isEmpty());
console.log(queue.size());
```

## 击鼓传花

``` js
// 击鼓传花
function passGame(nameList, num) {
  // 1.创建一个队列结构
  var queue = new Queue();

  // 2.将所有人依次加入到队列中
  for (var i = 0; i < nameList.length; i++) {
    queue.enqueue(nameList[i]);
  }

  // 3.开始数数字
  while (queue.size() > 1) {
    // 不是num的时候，重新加入到队列的末尾
    // 是num这个数字的时候，将其从队列中删除

    // 3.1 num数字之前的人重新放入队列的末尾
    for (var i = 0; i < num - 1; i++) {
      queue.enqueue(queue.dequeue());
    }

    // 3.2 num对应的这个人，直接从队列中删除
    queue.dequeue();
  }

  // 4.获取剩下的那个人
  var name = queue.front();
  console.log("最终剩下的人： " + name);

  return nameList.indexOf(name);
}

// 测试
names = ["a", "b", "c", "d"];

console.log(passGame(names, 1));
```
