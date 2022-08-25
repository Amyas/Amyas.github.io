package com.amyas;

import com.amyas.list.LinkedList;
import com.amyas.list.List;

public class Queue<E> {
  private List<E> list = new LinkedList<>();

  public int size() {
    return list.size();
  }

  public boolean isEmpty() {
    return list.isEmpty();
  }

  public void enQueue(E element) {
    list.add(element);
  }

  public E dequeue() {
    return list.remove(0);
  }

  public E front(){
    return list.get(0);
  }

}
