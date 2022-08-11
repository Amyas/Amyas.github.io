package com.amyas;

public class LinkedList<E> extends AbstractList<E> {
  private Node<E> first;

  private static class Node<E> {
    E element;
    Node<E> next;

    public Node(E element, Node<E> next) {
      this.element = element;
      this.next = next;
    }
  }

  @Override
  public void clear() {
  }

  @Override
  public E get(int index) {
    return null;
  }

  @Override
  public E set(int index, E element) {
    return null;
  }

  @Override
  public void add(int index, E element) {

  }

  @Override
  public E remove(int index) {
    return null;
  }

  @Override
  public int indexOf(E element) {
    return 0;
  }
}
