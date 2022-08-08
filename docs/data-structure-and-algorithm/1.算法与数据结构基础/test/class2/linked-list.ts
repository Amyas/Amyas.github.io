// 单向链表节点结构
class LinkedListNode {
  public value: Number | null = null;
  public next: LinkedListNode | null = null;

  public constructor(data: Number) {
    this.value = data;
  }
  public toString() {
    return `${this.value},${this.next}`;
  }
}

// 双向链表节点结构
class DoubleLinkedListNode {
  public value: Number | null = null;
  public prev: DoubleLinkedListNode | null = null;
  public next: DoubleLinkedListNode | null = null;

  public constructor(data: Number) {
    this.value = data;
  }
  public toString() {
    let str = "";
    let current: DoubleLinkedListNode | null = this;
    while (current) {
      str += `${current.value}`;
      current = current.next;
    }
    return str;
  }
}

class Code01_ReverseList {
  /**
   * 单链表反转
   */
  public static reverseLinkedList(
    head: LinkedListNode | null
  ): LinkedListNode | null {
    let pre: LinkedListNode | null = null;
    let next: LinkedListNode | null = null;

    while (head !== null) {
      next = head.next;
      head.next = pre;
      pre = head;
      head = next;
    }

    return pre;
  }
  /**
   * 双链表反转
   */
  public static reverseDoubleLinkedList(
    head: DoubleLinkedListNode | null
  ): DoubleLinkedListNode | null {
    let pre: DoubleLinkedListNode | null = null;
    let next: DoubleLinkedListNode | null = null;

    while (head !== null) {
      next = head.next;

      head.next = pre;
      head.prev = next;
      pre = head;

      head = next;
    }

    return pre;
  }
  /**
   * 删除链表指定值的节点
   */
  public static removeValue(
    head: LinkedListNode | null,
    num: Number
  ): LinkedListNode | null {
    while (head !== null) {
      if (head.value !== num) {
        break;
      }
      head = head.next;
    }

    let pre = head;
    let cur = head;

    while (cur !== null && pre !== null) {
      if (cur.value === num) {
        pre.next = cur.next;
      } else {
        pre = cur;
      }
      cur = cur.next;
    }

    return head;
  }
  /**
   * 根据数组生成单或双链表
   */
  public static generateLinkedList(
    arr: Number[],
    type: "linked" | "double"
  ): LinkedListNode | DoubleLinkedListNode {
    const list = arr.map((i) =>
      type === "linked" ? new LinkedListNode(i) : new DoubleLinkedListNode(i)
    );
    list.forEach((item, index) => {
      item.next = list[index + 1] || null;

      if (type === "double") {
        (item as DoubleLinkedListNode).prev =
          (list[index - 1] as DoubleLinkedListNode) || null;
      }
    });
    return list[0];
  }
  /**
   * 测试单向链表
   */
  public static testReverseLinkedList() {
    const arr = [1, 2, 3, 4];
    const head = this.generateLinkedList(arr, "linked") as LinkedListNode;

    const res = this.reverseLinkedList(head);
    console.log(res?.toString());
  }
  /**
   * 测试双向链表
   */
  public static testReverseDoubleLinkedList() {
    const arr = [1, 2, 3, 4];
    const head = this.generateLinkedList(arr, "double") as DoubleLinkedListNode;

    const res = this.reverseDoubleLinkedList(head);
    console.log(res?.toString());
  }
  /**
   * 测试删除节点
   */
  public static testRemoveValue() {
    const arr = [1, 2, 3, 4, 4, 3, 3, 2, 5, 1, 4];
    const head = this.generateLinkedList(arr, "linked") as LinkedListNode;

    const res = this.removeValue(head, 4);
    console.log(res?.toString());
  }
}

// Code01_ReverseList.testReverseLinkedList();
// Code01_ReverseList.testReverseDoubleLinkedList();
Code01_ReverseList.testRemoveValue();
