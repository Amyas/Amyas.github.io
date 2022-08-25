package com.amyas;

public class Main {
  public static void main(String[] args) {
    // Queue<Integer> queue = new Queue<>();
    // queue.enQueue(1);
    // queue.enQueue(2);
    // queue.enQueue(3);
    // queue.enQueue(4);

    Deque<Integer> queue = new Deque<>();
    queue.enQueueFront(1);
    queue.enQueueFront(2);
    queue.enQueueRear(3);
    queue.enQueueRear(4);
    System.out.println(queue);

    // 2134

    while (!queue.isEmpty()) {
      System.out.println(queue.deQueueFront());
    }
  }
}
