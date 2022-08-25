package com.amyas;

import java.lang.Comparable;
import com.amyas.printer.BinaryTreeInfo;

@SuppressWarnings("unchecked")
public class BinarySearchTree<E> implements BinaryTreeInfo {
  private int size;
  private Node<E> root;
  private Comparator<E> comparator;

  public BinarySearchTree() {
    this(null);
  }

  public BinarySearchTree(Comparator<E> comparator) {
    this.comparator = comparator;
  }

  private static class Node<E> {
    E element;
    Node<E> left;
    Node<E> right;
    Node<E> parent;

    public Node(E element, Node<E> parent) {
      this.element = element;
      this.parent = parent;
    }
  }

  public int size() {
    return size;
  }

  public boolean isEmpty() {
    return size == 0;
  }

  public void clear() {

  }

  public void add(E element) {
    elementNotNullCheck(element);

    // 添加第一个节点
    if (root == null) {
      root = new Node<E>(element, null);
      size++;
      return;
    }

    // 添加后续节点
    // 找到父节点
    Node<E> parent = root;
    Node<E> node = root;
    int cmp = 0;

    while (node != null) {
      cmp = compare(element, node.element);

      parent = node;

      if (cmp > 0) { // 找right
        node = node.right;
      } else if (cmp < 0) { // 找left
        node = node.left;
      } else { // 相等
        node.element = element;
        return; 
      }
    }

    // 看看拆入到父节点的哪个位置
    Node<E> newNode = new Node<E>(element, parent);
    if (cmp > 0) {
      parent.right = newNode;
    } else {
      parent.left = newNode;
    }

    size++;
  }

  public void remove(E element) {

  }

  public boolean contains(E element) {
    return false;
  }

  // =0，相等，>0，e1>e2，<0，e1<e2
  private int compare(E e1, E e2) {
    if (comparator != null) {
      return comparator.compare(e1, e2);
    }
    return ((Comparable<E>) e1).compareTo(e2);
  }

  private void elementNotNullCheck(E element) {
    if (element == null) {
      throw new IllegalArgumentException("element must not be null");
    }
  }

  @Override
  public Object root() {
    return root;
  }

  @Override
  public Object left(Object node) {
    return ((Node<E>) node).left;
  }

  @Override
  public Object right(Object node) {
    return ((Node<E>) node).right;
  }

  @Override
  public Object string(Object node) {
    return ((Node<E>) node).element;
  }
}
