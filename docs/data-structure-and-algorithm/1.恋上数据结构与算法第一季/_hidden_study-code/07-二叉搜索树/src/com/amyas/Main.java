package com.amyas;

import com.amyas.printer.BinaryTrees;

public class Main {
  static void test1() {
    Integer data[] = new Integer[] {
        7, 4, 9, 2, 5, 8, 11, 3, 12, 1
    };

    BinarySearchTree<Integer> bst = new BinarySearchTree<>();

    for (int i = 0; i < data.length; i++) {
      bst.add(data[i]);
    }

    BinaryTrees.println(bst);
  }

  static void test2() {
    Integer data[] = new Integer[] {
        7, 4, 9, 2, 5, 8, 11, 3, 12, 1
    };

    BinarySearchTree<Person> bst = new BinarySearchTree<>();

    for (int i = 0; i < data.length; i++) {
      bst.add(new Person(data[i]));
    }

    BinaryTrees.println(bst);
  }

  static void test3() {
    Integer data[] = new Integer[] {
        7, 4, 9, 2, 5, 8, 11, 3, 12, 1
    };

    BinarySearchTree<Person> bst = new BinarySearchTree<>(new Comparator<Person>() {
      @Override
      public int compare(Person e1, Person e2) {
        return e2.getAge() - e1.getAge();
      }
    });

    for (int i = 0; i < data.length; i++) {
      bst.add(new Person(data[i]));
    }

    BinaryTrees.println(bst);
  }

  static void test4() {
    BinarySearchTree<Integer> bst = new BinarySearchTree<>();
    for (int i = 0; i < 30; i++) {
      bst.add((int) (Math.random() * 100));
    }
    BinaryTrees.println(bst);
  }


  static void test5() {
    Integer data[] = new Integer[] {
        7, 4, 9, 2, 5, 8, 11, 3, 12, 1
    };

    BinarySearchTree<Integer> bst = new BinarySearchTree<>();

    for (int i = 0; i < data.length; i++) {
      bst.add(data[i]);
    }

    BinaryTrees.println(bst);
    // bst.preorderTraversal();
    // bst.inorderTraversal();
    bst.postorderTraversal();
  }

  public static void main(String[] args) {
    // test2();
    // test3();
    // test4();
    test5();
  }
}
