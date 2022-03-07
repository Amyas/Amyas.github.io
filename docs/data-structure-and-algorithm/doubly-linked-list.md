---
title: 双向链表
---

## 单向链表和双向链表

### 单向链表

- 只能从头遍历到尾或从尾遍历到头（一般从头到尾）。
- 链表相连的过程是单向的，实现原理是上一个节点中有指向下一个节点的引用。
- 单向链表有一个比较明显的缺点：可以轻松达到下一个节点，但回到前一个节点很难，在实际开发中，经常会遇到需要回到上一个节点的情况。

### 双向链表

- 既可以从头遍历到尾，也可以从尾遍历到头。
- 链表相连的过程是双向的。实现原理是一个节点既有向前连接的引用，也有一个向后连接的引用。
- 双向链表可以有效的解决单向链表存在的问题。
- 双向链表缺点：
  - 每次在插入或删除某一个节点时，都需要处理四个引用，而不是两个，实现起来会困难些。
  - 相对于单向链表，所占内存空间更大一些。
  - 但是，相对于双向链表的便利性而言，这些缺点微不足道。
## 双向链表的结构

![doubly-linked-list2022-03-07-14-25-59](https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/doubly-linked-list2022-03-07-14-25-59.png)

- 双向链表不仅有head指针指向第一个节点，而且还有tail节点指向最后一个节点。
- 每一个节点由三部分组成：item存储数据、prev指向前一个节点、next指向后一个节点。
- 双向链表的第一个节点的prev指向null。
- 双向链表的最后一个节点的next指向null。

## 双向链表常见的操作

- `append(element)` 向链表尾部插入一个新元素。
- `insert(position, element)` 向链表的指定位置插入一个新元素。
- `get(position)` 获取指定位置的元素。
- `indexOf(element)` 返回元素在链表中的索引。如果链表中没有该元素就返回-1。
- `update(position, element)` 修改指定位置上的元素。
- `removeAt(position)` 从链表中的指定位置删除元素。
- `remove(element)` 从链表中删除指定元素。
- `isEmpty()` 如果链表中不包含任何元素，返回true，如果链表长度大于0则返回false。
- `size()` 返回链表包含的元素个数，与数组的length属性类似。
- `toString()` 由于链表项使用Node类，就需要重写继承自JavaScript对象默认的toString方法，让其是输出元素的值。
- `forwardString()` 返回正向遍历节点字符串。
- `backwardString()` 返回反向遍历节点字符串。

## 创建双向链表 DoublyLinkedList 类

``` js
function DoublyLinkedList() {
  function Node(data){
    this.data = data
    this.prev = null
    this.next = null
  }

  this.head = null
  this.tail = null
  this.length = 0;
}
```

## 实现 append() 方法

``` js
DoublyLinkedList.prototype.append = function (data) {
  var newNode = new Node(data);
  if (this.length === 0) {
    // 是第一个节点
    this.head = newNode;
    this.tail = newNode;
  } else {
    this.tail.next = newNode;
    newNode.prev = this.tail;
    this.tail = newNode;
  }

  this.length += 1;
};
```

## 实现 toString\forwardString\backwardString 方法

``` js
DoublyLinkedList.prototype.toString = function(){
  return this.backwardString()
}
DoublyLinkedList.prototype.forwardString = function () {
  var current = this.tail;
  var resultString = "";
  while (current) {
    resultString += current.data + " ";
    current = current.prev;
  }
  return resultString;
};

DoublyLinkedList.prototype.backwardString = function () {
  var current = this.head;
  var resultString = "";
  while (current) {
    resultString += current.data + " ";
    current = current.next;
  }
  return resultString;
};
```

## 实现 insert() 方法

``` js
DoublyLinkedList.prototype.insert = function (position, data) {
  if (position < 0 || position > this.length) return false;

  var newNode = new Node(data);

  // 3.判断原来的列表是否为空
  if (this.length === 0) {
    this.head = newNode;
    this.tail = newNode;
  } else {
    if (position === 0) {
      // 3.1 判断position是否为0
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    } else if (position === this.length) {
      // 3.2 判断position是否为最后
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    } else {
      var current = this.head;
      var index = 0;
      while (index++ < position) {
        current = current.next;
      }
      newNode.next = current;
      newNode.prev = current.prev;
      current.prev.next = newNode;
      current.prev = newNode;
    }
  }

  this.length += 1;

  return true;
};
```

## 实现 get() 方法

``` js
DoublyLinkedList.prototype.get = function (position) {
  if (position < 0 || position >= this.length) return null;

  var current = this.head;
  var index = 0;

  while (index++ < position) {
    current = current.next;
  }

  return current.data;
};
```

## 实现 indexOf() 方法

``` js
DoublyLinkedList.prototype.indexOf = function (data) {
  var current = this.head;
  var index = 0;
  while (current) {
    if (current.data === data) {
      return index;
    }
    current = current.next;
    index += 1;
  }
  return -1;
};
```

## 实现 update() 方法

``` js
DoublyLinkedList.prototype.update = function (position, data) {
  if (position < 0 || position >= this.length) return false;

  var current = this.head;
  var index = 0;
  while (index++ < position) {
    current = current.next;
  }

  current.data = data;
  return true;
};
```

## 实现 removeAt() 方法

``` js
DoublyLinkedList.prototype.removeAt = function (position) {
  if (position < 0 || position >= this.length) return null;

  var current = this.head;
  if (this.length === 1) {
    this.head = null;
    this.tail = null;
  } else {
    if (position === 0) {
      // 第一个节点
      this.head.next.prev = null;
      this.head = this.head.next;
    } else if (position === this.length - 1) {
      current = this.tail;
      // 最后一个节点
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
    } else {
      // 中间节点
      var index = 0;
      while (index++ < position) {
        current = current.next;
      }
      current.prev.next = current.next;
      current.next.prev = current.prev;
    }
  }
  this.length -= 1;

  return current.data;
};
```
