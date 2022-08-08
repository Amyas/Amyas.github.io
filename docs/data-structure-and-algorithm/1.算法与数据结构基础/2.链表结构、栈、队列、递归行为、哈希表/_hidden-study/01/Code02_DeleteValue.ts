import { LinkedListBase, LinkedListNode } from "./Code01_ReverseList";

class Code02_DeleteValue extends LinkedListBase {
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
   * 测试删除节点
   */
  public static testRemoveValue() {
    const arr = [1, 2, 3, 4, 4, 3, 3, 2, 5, 1, 4];
    const head = this.generateLinkedList(arr, "linked") as LinkedListNode;

    const res = this.removeValue(head, 4);
    console.log(res?.toString());
  }
}
Code02_DeleteValue.testRemoveValue();
