package com.amyas;

import com.amyas.list.LinkedList;
import com.amyas.list.List;

public class Deque<E> {
  private List<E> list = new LinkedList<>();

  public int size() {
    return list.size();
  }

  public boolean isEmpty() {
    return list.isEmpty();
  }

  public void enQueueRear(E element) {
    list.add(element);
  }

  public E deQueueRear() {
    return list.remove(list.size() - 1);
  }

  public void enQueueFront(E element) {
    list.add(0, element);
  }

  public E deQueueFront() {
    return list.remove(0);
  }

  public E front() {
    return list.get(0);
  }

  public E rear() {
    return list.get(list.size() - 1);
  }
}
