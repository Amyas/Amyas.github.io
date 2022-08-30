package com.amyas;

import com.amyas.printer.BinaryTrees;

public class Main {
  static void test1() {
    Integer data[] = new Integer[] {
        91, 69, 6, 62, 9, 22, 31, 89, 55, 98, 78, 27, 26, 44, 18, 82, 40, 86, 84
    };

    AVLTree<Integer> avl = new AVLTree<>();

    for (int i = 0; i < data.length; i++) {
      avl.add(data[i]);
    }

    BinaryTrees.println(avl);
  }

  public static void main(String[] args) {
    test1();
  }
}
