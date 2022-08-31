package com.amyas;

import java.util.Arrays;

import com.amyas.sort.BubbleSort1;
import com.amyas.sort.BubbleSort2;
import com.amyas.sort.BubbleSort3;
import com.amyas.sort.SelectionSort;
import com.amyas.sort.Sort;
import com.amyas.tools.Integers;

public class Main {
  public static void main(String[] args) {
    // Integer[] array1 = Integers.random(10000, 1, 100000);
    // Integer[] array1 = Integers.ascOrder(1, 10000);
    // Integer[] array1 = Integers.tailAscOrder(1, 10000, 2000);
    // Integer[] array2 = Integers.copy(array1);
    // Integer[] array3 = Integers.copy(array1);
    // Integers.println(array1);

    // Times.test("冒泡排序bubbleSort1", () -> {
    // bubbleSort1(array1);
    // });

    // Times.test("冒泡排序bubbleSort2", () -> {
    // bubbleSort2(array2);
    // });

    // Times.test("冒泡排序bubbleSort3", () -> {
    // bubbleSort3(array3);
    // });

    // Integer[] array = Integers.random(10, 1, 100);
    // Integers.println(array);
    // selectorSort(array);
    // Integers.println(array);
    // Asserts.test(Integers.isAscOrder(array));

    Integer[] array = Integers.random(1000, 1, 20000);
    testSorts(
        array,
        new BubbleSort1(), new BubbleSort2(), new BubbleSort3(),
        new SelectionSort());
  }

  static void testSorts(Integer[] array, Sort... sorts) {
    for (Sort sort : sorts) {
      sort.sort(Integers.copy(array));
    }
    Arrays.sort(sorts);
    for (Sort sort : sorts) {
      System.out.println(sort);
    }
  }

  static void selectorSort(Integer[] array) {
    for (int end = array.length - 1; end > 0; end--) {
      int maxIndex = 0;
      for (int begin = 1; begin <= end; begin++) {
        if (array[maxIndex] <= array[begin]) {
          maxIndex = begin;
        }
      }
      int tmp = array[maxIndex];
      array[maxIndex] = array[end];
      array[end] = tmp;
    }
  }

  static void bubbleSort1(Integer[] array) {
    for (int end = array.length - 1; end > 0; end--) {
      for (int begin = 1; begin <= end; begin++) {
        if (array[begin] < array[begin - 1]) {
          int tmp = array[begin];
          array[begin] = array[begin - 1];
          array[begin - 1] = tmp;
        }
      }
    }
  }

  static void bubbleSort2(Integer[] array) {
    for (int end = array.length - 1; end > 0; end--) {
      boolean sorted = true;
      for (int begin = 1; begin <= end; begin++) {
        if (array[begin] < array[begin - 1]) {
          int tmp = array[begin];
          array[begin] = array[begin - 1];
          array[begin - 1] = tmp;
          sorted = false;
        }
      }

      if (sorted) {
        break;
      }
    }
  }

  static void bubbleSort3(Integer[] array) {
    for (int end = array.length - 1; end > 0; end--) {
      // sortedIndex 的初始值在数组完全有序的时候有用
      int sortedIndex = 1;
      for (int begin = 1; begin <= end; begin++) {
        if (array[begin] < array[begin - 1]) {
          int tmp = array[begin];
          array[begin] = array[begin - 1];
          array[begin - 1] = tmp;
          sortedIndex = begin;
        }
      }

      end = sortedIndex;
    }
  }
}
