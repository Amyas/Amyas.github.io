package com.amyas;

import java.util.Arrays;

import com.amyas.sort.BubbleSort3;
import com.amyas.sort.InsertionSort3;
import com.amyas.sort.MergeSort;
import com.amyas.sort.QuickSort;
import com.amyas.sort.SelectionSort;
import com.amyas.sort.ShellSort;
import com.amyas.sort.Sort;
import com.amyas.tools.Asserts;
import com.amyas.tools.Integers;

@SuppressWarnings({ "rawtypes", "unchecked" })
public class Main {
  public static void main(String[] args) {
    Integer[] array = Integers.random(30000, 1, 30000);
    testSorts(
        array,
        new ShellSort(),
        new QuickSort(),
        new MergeSort(),
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
