package 队列;

import java.util.Stack;

/**
 * https://leetcode.cn/problems/implement-queue-using-stacks/
 */
public class _232_用栈实现队列 {
  private Stack<Integer> inStack;
  private Stack<Integer> outStack;

  public _232_用栈实现队列() {
    inStack = new Stack<>();
    outStack = new Stack<>();
  }

  public void push(int x) {
    inStack.push(x);
  }

  public int pop() {
    checkOutStack();
    return outStack.pop();
  }

  public int peek() {
    checkOutStack();
    return outStack.peek();
  }

  public boolean empty() {
    return inStack.isEmpty() && outStack.isEmpty();
  }

  private void checkOutStack() {
    if (outStack.isEmpty()) {
      while (!inStack.isEmpty()) {
        outStack.push(inStack.pop());
      }
    }
  }
}
