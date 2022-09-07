package com.amyas.sort;

public class InsertionSort3<E extends Comparable<E>> extends Sort<E> {
  @Override
  protected void sort() {
    for (int begin = 1; begin < array.length; begin++) {
      insert(begin, search(begin));
    }
  }

  /**
   * 将source位置的元素插入到dest位置
   * 
   * @param sourceIndex
   * @param destIndex
   */
  private void insert(int sourceIndex, int destIndex) {
    E v = array[sourceIndex];
    for (int i = sourceIndex; i > destIndex; i--) {
      array[i] = array[i - 1];
    }
    array[destIndex] = v;
  }

  /**
   * 利用二分搜索找到index位置元素的待插入位置
   * 已经拍好序数组的区间范围[0, index)
   * 
   * @param index
   * @return
   */
  private int search(int index) {
    int begin = 0;
    int end = index;
    while (begin < end) {
      int mid = (begin + end) >> 1;
      if (cmp(array[index], array[mid]) < 0) {
        end = mid;
      } else {
        begin = mid + 1;
      }
    }
    return begin;
  }
}
