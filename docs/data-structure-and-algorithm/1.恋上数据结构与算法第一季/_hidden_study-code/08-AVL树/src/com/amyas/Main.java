package com.amyas;

import com.amyas.printer.BinaryTrees;

public class Main {
  static void test1() {
    Integer data[] = new Integer[] {
        85, 19, 69, 3, 7, 99, 95
    };

    AVLTree<Integer> avl = new AVLTree<>();

    for (int i = 0; i < data.length; i++) {
      avl.add(data[i]);
    }

    BinaryTrees.println(avl);

    avl.remove(99);
    avl.remove(85);
    avl.remove(95);
    BinaryTrees.println(avl);
  }

  public static void main(String[] args) {
    test1();
  }
}
