package com.amyas;

import com.amyas.cirle.CircleQueue;

public class Main {
  static void test1() {
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

    while (!queue.isEmpty()) {
      System.out.println(queue.deQueueFront());
    }
  }

  static void test2() {
    CircleQueue<Integer> queue = new CircleQueue<Integer>();
    // 0 1 2 3 4 5 6 7 8 9
    for (int i = 0; i < 10; i++) {
      queue.enQueue(i);
    }
    // null null null null null 5 6 7 8 9
    for (int i = 0; i < 5; i++) {
      queue.deQueue();
    }
    // 15 16 17 18 19 5 6 7 8 9
    for (int i = 15; i < 20; i++) {
      queue.enQueue(i);
    }
    System.out.println(queue);
    while (!queue.isEmpty()) {
      System.out.println(queue.deQueue());
    }
    System.out.println(queue);
  }

  public static void main(String[] args) {
    test2();
  }
}
