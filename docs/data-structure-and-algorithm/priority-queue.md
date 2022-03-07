---
title: 优先队列
---

## 场景

生活中类似**优先队列**的场景：

- 优先排队的人，优先处理。
- 排队中，有紧急情况的人可以优先处理。

## 优先队列

优先级队列主要考虑的问题：

- 每个元素不再只是一个数据，还包含优先级。
- 在添加元素过程中，根据优先级放入到正确的位置。

## 优先队列的实现

### 代码实现

``` js
function PriorityQueue() {
  // 实现一个内部类
  function QueueElement(element, priority) {
    this.element = element;
    this.priority = priority;
  }

  // 封装属性
  this.items = [];

  // 实现插入方法
  PriorityQueue.prototype.enqueue = function (element, priority) {
    // 1.创建QueueElement对象
    var queueElement = new QueueElement(element, priority);

    // 2.判断队列是否为空
    if (this.items.length === 0) {
      this.items.push(queueElement);
    } else {
      var added = false;
      for (var i = 0; i < this.items.length; i++) {
        if (queueElement.priority < this.items[i].priority) {
          this.items.splice(i, 0, queueElement);
          added = true;
          break;
        }
      }
      if (!added) {
        this.items.push(queueElement);
      }
    }
  };

  // 2.从队列中删除前端元素
  PriorityQueue.prototype.dequeue = function () {
    return this.items.shift();
  };

  // 3.查看前端元素
  PriorityQueue.prototype.front = function () {
    return this.items[0];
  };

  // 4.查看队列是否为空
  PriorityQueue.prototype.isEmpty = function () {
    return this.items.length === 0;
  };

  // 5.产看队列中元素的个数
  PriorityQueue.prototype.size = function () {
    return this.items.length;
  };

  PriorityQueue.prototype.toString = function () {
    let result = "";
    for (let item of this.items) {
      result += item.element + "-" + item.priority + " ";
    }
    return result;
  };
}
```

### 测试代码

``` js
const priorityQueue = new PriorityQueue();

// 入队 enqueue() 测试
priorityQueue.enqueue("A", 10);
priorityQueue.enqueue("B", 15);
priorityQueue.enqueue("C", 11);
priorityQueue.enqueue("D", 20);
priorityQueue.enqueue("E", 18);
console.log(priorityQueue.items);
//--> output:
// QueueElement {element: "A", priority: 10}
// QueueElement {element: "C", priority: 11}
// QueueElement {element: "B", priority: 15}
// QueueElement {element: "E", priority: 18}
// QueueElement {element: "D", priority: 20}

// 出队 dequeue() 测试
priorityQueue.dequeue();
priorityQueue.dequeue();
console.log(priorityQueue.items);
//--> output:
// QueueElement {element: "B", priority: 15}
// QueueElement {element: "E", priority: 18}
// QueueElement {element: "D", priority: 20}

// isEmpty() 测试
console.log(priorityQueue.isEmpty()); //--> false

// size() 测试
console.log(priorityQueue.size()); //--> 3

// toString() 测试
console.log(priorityQueue.toString()); //--> B-15 E-18 D-20
```

## 数组、栈、队列图解

![priority-queue2022-03-07-12-05-45](https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/priority-queue2022-03-07-12-05-45.png)