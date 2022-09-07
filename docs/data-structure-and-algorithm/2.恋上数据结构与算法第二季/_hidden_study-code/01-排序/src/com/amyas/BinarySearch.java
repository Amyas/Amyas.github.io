package com.amyas;

public class BinarySearch {
  public static int indexOf(Integer[] array, int v) {
    if (array == null || array.length == 0) {
      return -1;
    }

    int begin = 0;
    int end = array.length;

    while (begin < end) {
      int mid = (begin + end) >> 1;
      if (v < array[mid]) {
        end = mid;
      } else if (v > array[mid]) {
        begin = mid + 1;
      } else {
        return mid;
      }
    }

    return -1;
  }
}
