package com.amyas;

import com.amyas.printer.BinaryTrees;

public class Main {
  static void test1() {
    Integer data[] = new Integer[] {
        7, 4, 9, 2, 5, 8, 11, 3, 12, 1
    };

    AVLTree<Integer> bst = new AVLTree<>();

    for (int i = 0; i < data.length; i++) {
      bst.add(data[i]);
    }

    BinaryTrees.println(bst);
  }

  public static void main(String[] args) {
    test1();
  }
}
