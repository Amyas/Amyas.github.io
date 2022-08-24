package com.amyas;

import com.amyas.single.SingleLinkedList2;

public class Main {
  public static void main(String[] args) {
    List<Integer> list = new SingleLinkedList2<>();
    list.add(20);
    list.add(0, 10);
    list.add(30);
    list.add(list.size(), 40);

    list.remove(1);

    System.out.println(list);
  }
}
