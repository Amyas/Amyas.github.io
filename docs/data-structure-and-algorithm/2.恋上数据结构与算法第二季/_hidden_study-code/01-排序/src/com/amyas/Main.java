package com.amyas;

import java.util.Arrays;

import com.amyas.sort.BubbleSort3;
import com.amyas.sort.InsertionSort1;
import com.amyas.sort.InsertionSort2;
import com.amyas.sort.InsertionSort3;
import com.amyas.sort.SelectionSort;
import com.amyas.sort.Sort;
import com.amyas.tools.Asserts;
import com.amyas.tools.Integers;

@SuppressWarnings({ "rawtypes", "unchecked" })
public class Main {
  public static void main(String[] args) {
    Integer[] array = Integers.random(10000, 1, 20000);
    testSorts(
        array,
        new InsertionSort1(),
        new InsertionSort2(),
        new InsertionSort3(),
        new BubbleSort3(),
        new SelectionSort());
  }

  static void testSorts(Integer[] array, Sort... sorts) {
    for (Sort sort : sorts) {
      Integer[] newArray = Integers.copy(array);
      sort.sort(newArray);
      Asserts.test(Integers.isAscOrder(newArray));
    }
    Arrays.sort(sorts);
    for (Sort sort : sorts) {
      System.out.println(sort);
    }
  }
}
