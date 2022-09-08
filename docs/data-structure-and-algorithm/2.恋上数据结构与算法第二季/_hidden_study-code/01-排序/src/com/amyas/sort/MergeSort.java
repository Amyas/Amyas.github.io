package com.amyas.sort;

@SuppressWarnings("unchecked")
public class MergeSort<T extends Comparable<T>> extends Sort<T> {
  private T[] leftArray;

  @Override
  protected void sort() {
    leftArray = (T[]) new Comparable[array.length >> 1];
    sort(0, array.length);
  }

  /**
   * 对[begin, end)范围的数据进行归并排序
   * 左闭右开（包含begin，不包含end）
   * 
   * @param begin
   * @param end
   */
  private void sort(int begin, int end) {
    if ((end - begin) < 2) {
      return;
    }

    int mid = (begin + end) >> 1;
    sort(begin, mid);
    sort(mid, end);
    merge(begin, mid, end);
  }

  /**
   * 将[begin, mid) 和 [mid, end) 范围的序列合并
   * 
   * @param begin
   * @param mid
   * @param end
   */
  private void merge(int begin, int mid, int end) {
    int leftIndex = 0;
    int leftEnd = mid - begin;
    int rightIndex = mid;
    int rightEnd = end;
    int arrayIndex = begin;

    // 备份左边数组
    for (int i = leftIndex; i < leftEnd; i++) {
      leftArray[i] = array[begin + i];
    }

    // 左边还没结束
    while (leftIndex < leftEnd) {
      if (rightIndex < rightEnd && cmp(array[rightIndex], leftArray[leftIndex]) < 0) {
        array[arrayIndex++] = array[rightIndex++];
      } else {
        array[arrayIndex++] = leftArray[leftIndex++];
      }
    }
  }
}
