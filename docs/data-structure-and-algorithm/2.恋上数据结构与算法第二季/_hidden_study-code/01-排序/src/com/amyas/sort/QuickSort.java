package com.amyas.sort;

public class QuickSort<T extends Comparable<T>> extends Sort<T> {

  @Override
  protected void sort() {
    sort(0, array.length);
  }

  /**
   * 对[begin, end)范围内的元素进行快速排序
   * 
   * @param begin
   * @param end
   */
  private void sort(int begin, int end) {
    if (end - begin < 2) {
      return;
    }

    // 确定轴点位置
    int mid = pivotIndex(begin, end);

    // 对子序列进行快速排序
    sort(begin, mid);
    sort(mid + 1, end);
  }

  /**
   * 构造出[begin, end)范围的轴点元素
   * 
   * @param begin
   * @param end
   * @return 轴点元素的最终位置
   */
  private int pivotIndex(int begin, int end) {
    // 随机选择一个元素作为轴点，和begin交换就可以
    swap(begin, begin + (int) Math.random() * (end - begin));

    // 备份begin位置的元素
    T pivot = array[begin];
    // end指向最后一个元素
    end--;

    while (begin < end) {
      while (begin < end) {
        if (cmp(pivot, array[end]) < 0) { // 右边大于轴点 pivot
          end--;
        } else {// 右边小于等于轴点 pivot
          array[begin++] = array[end];
          break;
        }
      }

      while (begin < end) {
        if (cmp(pivot, array[begin]) > 0) { // 左边小于轴点 pivot
          begin++;
        } else { // 左边大于等于轴点 pivot
          array[end--] = array[begin];
          break;
        }
      }
    }

    // 将轴点元素放入最终的位置
    array[begin] = pivot;

    // 来到这里代表begin == end，直接返回位置就可以
    return begin;
  }
}
