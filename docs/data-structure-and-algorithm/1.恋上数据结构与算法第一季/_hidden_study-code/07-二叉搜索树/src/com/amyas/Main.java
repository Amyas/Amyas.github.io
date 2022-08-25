package com.amyas;

import com.amyas.printer.BinaryTrees;

public class Main {
  private static class PersonComparator implements Comparator<Person> {
    public int compare(Person e1, Person e2) {
      return e1.getAge() - e2.getAge();
    }
  }

  private static class PersonComparator2 implements Comparator<Person> {
    public int compare(Person e1, Person e2) {
      return e2.getAge() - e1.getAge();
    }
  }

  public static void main(String[] args) {
    Integer data[] = new Integer[] {
        7, 4, 9, 2, 5, 8, 11, 3, 12, 1
    };

    BinarySearchTree<Integer> bst = new BinarySearchTree<>();

    for (int i = 0; i < data.length; i++) {
      bst.add(data[i]);
    }

    BinaryTrees.println(bst);

    // BinarySearchTree<Person> bst2 = new BinarySearchTree<>(new
    // PersonComparator());
    // bst2.add(new Person(10));
    // bst2.add(new Person(15));

    // BinarySearchTree<Person> bst3 = new BinarySearchTree<>(new
    // PersonComparator2());
    // bst3.add(new Person(10));
    // bst3.add(new Person(15));

    // BinarySearchTree<Car> bst4 = new BinarySearchTree<>();
    // bst4.add(new Car(10));
    // bst4.add(new Car(15));

    // BinarySearchTree<Person> bst5 = new BinarySearchTree<>(new
    // Comparator<Person>() {
    // public int compare(Person e1, Person e2) {
    // return e1.getAge() - e2.getAge();
    // };
    // });
    // bst5.add(new Person(10));
    // bst5.add(new Person(15));
  }
}
