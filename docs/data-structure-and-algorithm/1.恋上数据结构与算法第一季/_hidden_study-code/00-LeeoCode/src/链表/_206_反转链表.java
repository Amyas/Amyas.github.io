package 链表;

/*
 * https://leetcode.cn/problems/reverse-linked-list/
 */
public class _206_反转链表 {

  /**
   * 递归
   */
  public ListNode reverseList1(ListNode head) {
    if (head == null || head.next == null)
      return head;

    ListNode newHead = reverseList1(head.next);
    head.next.next = head;
    head.next = null;

    return newHead;
  }

  /**
   * 非递归
   */
  public ListNode reverseList2(ListNode head) {
    if (head == null || head.next == null)
      return head;

    ListNode newHead = null;
    ListNode curr = head;

    while (curr != null) {
      ListNode tmp = curr.next;
      curr.next = newHead;
      newHead = curr;
      curr = tmp;
    }

    return newHead;
  }
}
