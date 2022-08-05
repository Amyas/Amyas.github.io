---
title: 单向链表
---

## 认识链表

### 链表和数组

链表和数组一样，可以用于存储一系列的元素，但是链表和数组的实现机制完全不同。

#### 数组

- 存储多个元素，数组（或链表）可能是最常用的数据结构。
- 几乎每一种编程语言都有默认实现数据结构，提供了一个便利的`[]`语法来访问数组元素。
- 数组的缺点：
  - 数组的创建需要申请一段连续的内容空间（一整块内容），并且大小是固定的，当前数组不能满足容量需求时，需要扩容。（一般情况下是申请一个更大的数组，比如2倍，然后将原数组中的元素复制过去）。
  - 在数组开头或中间位置插入数据的成本很高。需要进行大量元素的位移。

#### 链表

- 存储多个元素，另外一个选择就是使用链表。
- 不同于数组，链表中的元素在内存中不必是连续的空间。
- 链表的每一个元素由一个存储元素本身的节点和一个指向下一个元素的引用（有些语言称为指针）组成。
- 链表优点：
  - 内存空间不必是连续的，可以充分利用计算机的内容，实现灵活的内存动态管理。
  - 链表不必在创建时就确定大小，并且大小可以无限延伸下去。
  - 链表在插入和删除数据时，时间复杂度可以达到O(1)，相对数组效率高很多。
- 链表缺点：
  - 访问任何一个位置的元素时，需要从头开发时访问。（无法跳过第一个元素访问任何一个元素）。
  - 无法通过下标值直接访问元素，需要从头开始一个个访问。直到找到对应的元素。
  - 虽然 可以轻松地到达下一个节点，但是回到前一个节点是很难的。

## 单向链表

单向链表类似于火车，有一个火车头，火车头会连接一个节点，节点上有乘客，并且整个节点会连接下一个节点，以此类推。

- 链表的火车结构：

![linked-list2022-03-07-12-16-52](https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/linked-list2022-03-07-12-16-52.png)

- 链表的数据结构：
  - head属性指向链表的第一个节点。
  - 链表的最后一个节点指向null。
  - 当链表中一个节点也没有的时候，head直接指向null。
  ![linked-list2022-03-07-12-18-14](https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/linked-list2022-03-07-12-18-14.png)
  
- 给火车加上数据结构后的结构：

![linked-list2022-03-07-12-18-51](https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/linked-list2022-03-07-12-18-51.png)

### 链表中的常见操作

- `append(element)` 向链表尾部添加一个新的项。
- `insert(position, element)` 向链表的特定位置插入一个新的项。
- `get(position)` 获取对应位置的元素。
- `indexOf(element)` 返回元素在链表中的索引。如果链表没有该元素就返回-1。
- `update(position, element)` 修改某一个位置的元素。
- `removeAt(position)` 从链表的特定位置移除一项。
- `remove(element)` 从链表中移除一项。
- `isEmpty()` 如果链表中不包含任何元素，返回true，如果链表长度大于0则返回false。
- `size()` 返回链表包含的元素个数，与数组的length属性类似。
- `toString()` 由于链表项使用了Node类，就需要重写继承自JavaScript对象默认的toString方法，让其只输出元素的值。

### 创建单向链表类

先创建单向链表类LinkedList，添加基本属性，再逐步实现单向链表的常用方法。

``` js
function LinkedList() {
  // 内部节点类
  function Node(data) {
    this.data = data;
    this.next = null;
  }

  // 属性
  this.head = null;
  this.length = 0;
}
```

### 实现 append() 方法

``` js
LinkedList.prototype.append = function (data) {
  // 1.创建新节点
  var newNode = new Node(data);

  // 2.判断是否添加的是第一个节点
  if (this.length === 0) {
    // 是第一个节点
    this.head = newNode;
  } else {
    // 不是第一个节点
    var current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }

  // 3.length+1
  this.length += 1;
};
```

#### 图解过程

- 首先让`current`指向第一个节点。
![linked-list2022-03-07-12-31-37](https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/linked-list2022-03-07-12-31-37.png)
- 通过`while`循环使`current`指向最后一个节点，最后通过`current.next = newNode`，让最后一个节点指向新节点`newNode`。
![linked-list2022-03-07-12-32-35](https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/linked-list2022-03-07-12-32-35.png)

#### 代码测试

``` js
const linkedList = new LinkedList();
// 测试 append 方法
linkedList.append("A");
linkedList.append("B");
linkedList.append("C");
console.log(linkedList);
```

![linked-list2022-03-07-12-33-11](https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/linked-list2022-03-07-12-33-11.png)


### 实现 toString() 方法

``` js
LinkedList.prototype.toString = function () {
  // 1.定义变量
  var current = this.head;
  var listString = "";

  // 2.循环获取一个个的节点
  while (current) {
    listString += current.data + " ";
    current = current.next;
  }

  return listString;
};
```

#### 代码测试

``` js
// 测试 toString 方法
console.log(linkedList.toString()); //--> AA BB CC
```

### 实现 insert() 方法

``` js
LinkedList.prototype.insert = function (position, data) {
  // 1.对position进行越界判断
  if (position < 0 || position > this.length) return false;

  // 2.根据data创建newNode
  var newNode = new Node(data);

  // 3.判断插入的位置是和否是第一个
  if (position === 0) {
    newNode.next = this.head;
    this.head = newNode;
  } else {
    var index = 0;
    var current = this.head;
    var prev = null;
    while (index++ < position) {
      prev = current;
      current = current.next;
    }
    newNode.next = current;
    prev.next = newNode;
  }

  // 4.length+1
  this.length += 1;
};
```

#### 代码测试

``` js
// 测试 insert 方法
linkedList.insert(0, "123");
linkedList.insert(2, "456");
console.log(linkedList.toString()); //--> 123 AA 456 BB CC
```

### 实现 get() 方法

``` js
LinkedList.prototype.get = function (position) {
  // 1.越界判断
  if (position < 0 || position >= this.length) return null;

  // 2.获取对应的data
  var current = this.head;
  var index = 0;
  while (index++ < position) {
    current = current.next;
  }

  return current.data;
};
```

#### 代码测试

``` js
// 测试 getData 方法
console.log(linkedList.get(0)); //--> 123
console.log(linkedList.get(1)); //--> AA
```

### 实现 indexOf() 方法

indexOf(data) 返回指定data的index，如果没有返回-1。

``` js
LinkedList.prototype.indexOf = function (data) {
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

#### 代码测试

``` js
// 测试 indexOf 方法
console.log(linkedList.indexOf("AA")); //--> 1
console.log(linkedList.indexOf("ABC")); //--> -1
```

### 实现 update() 方法

update(position, data) 修改指定位置节点的data。

``` js
LinkedList.prototype.update = function (position, element) {
  if (position < 0 || position >= this.length) return false;

  var current = this.head;
  var index = 0;
  while (index++ < position) {
    current = current.next;
  }
  current.data = element;
  return true;
};
```

#### 代码测试

``` js
// 测试 update 方法
linkedList.update(0, "12345");
console.log(linkedList.toString()); //--> 12345 AA 456 BB CC
linkedList.update(1, "54321");
console.log(linkedList.toString()); //--> 12345 54321 456 BB CC
```

### 实现 removeAt() 方法

removeAt(position) 删除指定位置的节点。

``` js
LinkedList.prototype.removeAt = function (position) {
  if (position < 0 || position >= this.length) return null;

  var current = this.head;
  if (position === 0) {
    this.head = this.head.next;
  } else {
    var prev = null;
    var index = 0;
    while (index++ < position) {
      prev = current;
      current = current.next;
    }
    prev.next = current.next;
  }

  this.length--;
  return current.data;
};
```

#### 代码测试

``` js
// 测试 removeAt 方法
linkedList.removeAt(3);
console.log(linkedList.toString()); //--> 12345 54321 456 CC
```

### 实现 remove() 方法

``` js
LinkedList.prototype.remove = function (element) {
  return this.removeAt(this.indexOf(element));
};
```

#### 代码测试

``` js
// 测试 remove 方法
linkedList.remove("CC");
console.log(linkedList.toString()); //--> 12345 54321 456
```

### 实现 isEmpty() 方法

``` js
LinkedList.prototype.isEmpty = function () {
  return this.length === 0;
};
```

#### 代码测试

``` js
// 测试 isEmpty 方法
console.log(linkedList.isEmpty()); //--> false
```

### 实现 size() 方法

``` js
LinkedList.prototype.size = function () {
  return this.length;
};
```

#### 代码测试

``` js
// 测试 size 方法
console.log(linkedList.size()); //--> 3
```

### 完整实现

``` js
function LinkedList() {
  // 内部节点类
  function Node(data) {
    this.data = data;
    this.next = null;
  }

  // 属性
  this.head = null;
  this.length = 0;

  LinkedList.prototype.append = function (data) {
    // 1.创建新节点
    var newNode = new Node(data);

    // 2.判断是否添加的是第一个节点
    if (this.length === 0) {
      // 是第一个节点
      this.head = newNode;
    } else {
      // 不是第一个节点
      var current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }

    // 3.length+1
    this.length += 1;
  };

  LinkedList.prototype.toString = function () {
    // 1.定义变量
    var current = this.head;
    var listString = "";

    // 2.循环获取一个个的节点
    while (current) {
      listString += current.data + " ";
      current = current.next;
    }

    return listString;
  };

  LinkedList.prototype.insert = function (position, data) {
    // 1.对position进行越界判断
    if (position < 0 || position > this.length) return false;

    // 2.根据data创建newNode
    var newNode = new Node(data);

    // 3.判断插入的位置是和否是第一个
    if (position === 0) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      var index = 0;
      var current = this.head;
      var prev = null;
      while (index++ < position) {
        prev = current;
        current = current.next;
      }
      newNode.next = current;
      prev.next = newNode;
    }

    // 4.length+1
    this.length += 1;
  };

  LinkedList.prototype.get = function (position) {
    // 1.越界判断
    if (position < 0 || position >= this.length) return null;

    // 2.获取对应的data
    var current = this.head;
    var index = 0;
    while (index++ < position) {
      current = current.next;
    }

    return current.data;
  };

  LinkedList.prototype.indexOf = function (data) {
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

  LinkedList.prototype.update = function (position, element) {
    if (position < 0 || position >= this.length) return false;

    var current = this.head;
    var index = 0;
    while (index++ < position) {
      current = current.next;
    }
    current.data = element;
    return true;
  };

  LinkedList.prototype.removeAt = function (position) {
    if (position < 0 || position >= this.length) return null;

    var current = this.head;
    if (position === 0) {
      this.head = this.head.next;
    } else {
      var prev = null;
      var index = 0;
      while (index++ < position) {
        prev = current;
        current = current.next;
      }
      prev.next = current.next;
    }

    this.length--;
    return current.data;
  };

  LinkedList.prototype.remove = function (element) {
    return this.removeAt(this.indexOf(element));
  };

  LinkedList.prototype.isEmpty = function () {
    return this.length === 0;
  };

  LinkedList.prototype.size = function () {
    return this.length;
  };
}
```