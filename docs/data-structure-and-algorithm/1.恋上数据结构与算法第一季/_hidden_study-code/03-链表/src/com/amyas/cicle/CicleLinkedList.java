package com.amyas.cicle;

import com.amyas.AbstractList;

public class CicleLinkedList<E> extends AbstractList<E> {
  private Node<E> first;
  private Node<E> last;

  private static class Node<E> {
    E element;
    Node<E> prev;
    Node<E> next;

    public Node(Node<E> prev, E element, Node<E> next) {
      this.prev = prev;
      this.element = element;
      this.next = next;
    }
  }

  @Override
  public void clear() {
    size = 0;
    first = null;
    last = null;
  }

  @Override
  public E get(int index) {
    return node(index).element;
  }

  @Override
  public E set(int index, E element) {
    Node<E> node = node(index);
    E old = node.element;
    node.element = element;
    return old;
  }

  @Override
  public void add(int index, E element) {
    rangeCheckForAdd(index);

    if (index == size) {// 往最后面添加元素
      // last = new Node<>(last, element, null);
      // last.prev.next = last;

      Node<E> oldLast = last;
      last = new Node<>(oldLast, element, first);
      if (oldLast == null) {
        // 链表第一个元素
        first = last;
        first.next = first;
        first.prev = first;
      } else {
        oldLast.next = last;
        first.prev = last;
      }
    } else {
      Node<E> next = node(index);
      Node<E> prev = next.prev;
      Node<E> node = new Node<>(prev, element, next);
      node.prev = node;
      prev.next = node;

      if (next == first) {
        // index == 0
        first = node;
      }
    }

    size++;
  }

  @Override
  public E remove(int index) {
    rangeCheck(index);

    Node<E> node = first;
    if (size == 1) {
      first = null;
      last = null;
    } else {
      node = node(index);
      Node<E> prev = node.prev;
      Node<E> next = node.next;

      if (node == first) {
        // index == 0
        first = next;
      }

      if (next == last) {
        // index == size - 1
        last = prev;
      }
    }

    size--;
    return node.element;
  }

  @Override
  public int indexOf(E element) {
    Node<E> node = first;
    if (element == null) {
      for (int i = 0; i < size; i++) {
        if (node.element == null)
          return i;
        node = node.next;
      }
    } else {
      for (int i = 0; i < size; i++) {
        if (element.equals(node.element))
          return i;
        node = node.next;
      }
    }

    return ELEMENT_NOT_FOUND;
  }

  /**
   * 获取index对应节点对象
   * 
   * @param index
   * @return
   */
  private Node<E> node(int index) {
    rangeCheck(index);

    if (index < (size >> 1)) { // size / 2
      Node<E> node = first;
      for (int i = 0; i < index; i++) {
        node = node.next;
      }
      return node;
    } else {
      Node<E> node = last;
      for (int i = size - 1; i > index; i--) {
        node = node.prev;
      }
      return node;
    }

  }

  @Override
  public String toString() {
    StringBuilder string = new StringBuilder();

    Node<E> node = first;
    string.append("Size=").append(size).append(", [");

    for (int i = 0; i < size; i++) {
      if (i != 0) {
        string.append(", ");
      }
      string.append(node.element);
      node = node.next;
    }

    string.append("]");

    return string.toString();
  }
}
