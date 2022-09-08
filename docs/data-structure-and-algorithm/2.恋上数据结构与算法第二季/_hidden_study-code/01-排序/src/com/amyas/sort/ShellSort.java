package com.amyas.sort;

import java.util.ArrayList;
import java.util.List;

public class ShellSort<T extends Comparable<T>> extends Sort<T> {

  @Override
  protected void sort() {
    // 步长序列
    List<Integer> stepSequence = shellStepSequence();
    for (Integer step : stepSequence) {
      sort(step);
    }
  }

  /**
   * 分成 step 列进行排序
   * 
   * @param step
   */
  private void sort(Integer step) {
    // col：第几列
    for (int col = 0; col < step; col++) {

      // 插入排序
      // col、col+step、col+2*step、col+3*step、col+4*step
      for (int begin = col + step; begin < array.length; begin += step) {
        int cur = begin;
        while (cur > col && cmp(cur, cur - step) < 0) {
          swap(cur, cur - step);
          cur -= step;
        }
      }
    }
  }

  /**
   * 生成希尔步长序列
   * 
   * @return
   */
  private List<Integer> shellStepSequence() {
    List<Integer> stepSequence = new ArrayList<>();
    int step = array.length;

    while ((step = step >> 1) > 0) {
      stepSequence.add(step);
    }

    return stepSequence;
  }
}
