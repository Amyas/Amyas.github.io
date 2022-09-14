package com.amyas.sort;

public class CountingSort<T> extends Sort<Integer> {
  @Override
  protected void sort() {
    // 找出最值
    int max = array[0];
    int min = array[0];
    for (int i = 1; i < array.length; i++) {
      if (array[i] > max) {
        max = array[i];
      }
      if (array[i] < min) {
        min = array[i];
      }
    }

    // 开辟空间，存储次数
    int[] counts = new int[max - min + 1];

    // 统计每个元素的出现次数
    for (int i = 0; i < array.length; i++) {
      counts[array[i] - min]++;
    }

    // 累加次数
    for (int i = 1; i < counts.length; i++) {
      counts[i] += counts[i - 1];
    }

    // 从后往前遍历，将他放到有序数组中的合适位置
    int[] newArray = new int[array.length];
    for (int i = array.length - 1; i >= 0; i--) {
      newArray[--counts[array[i] - min]] = array[i];
    }

    // 将有序数组赋值到array
    for (int i = 0; i < newArray.length; i++) {
      array[i] = newArray[i];
    }
  }

  protected void sortBase() {
    // 找出最大值
    int max = array[0];
    for (int i = 1; i < array.length; i++) {
      if (array[i] > max) {
        max = array[i];
      }
    }

    // 开辟内存空间，存储每个整数出现的次数
    int[] counts = new int[1 + max];
    // 统计每个整数出现的次数
    for (int i = 0; i < array.length; i++) {
      counts[array[i]]++;
    }

    // 根据整数出现的次数，对整数进行排序
    int index = 0;
    for (int i = 0; i < counts.length; i++) {
      while (counts[i]-- > 0) {
        array[index++] = i;
      }
    }
  }
}
