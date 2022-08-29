package com.amyas;

import java.lang.Comparable;
import java.util.LinkedList;
import java.util.Queue;

// BinarySearchTree

@SuppressWarnings("unchecked")
public class BST<E> extends BinaryTree<E> {
  private Comparator<E> comparator;

  public BST() {
    this(null);
  }

  public BST(Comparator<E> comparator) {
    this.comparator = comparator;
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
    remove(node(element));
  }

  private void remove(Node<E> node) {
    if (node == null) {
      return;
    }
    size--;

    // 度为2的节点
    if (node.hasTwoChildren()) {
      // 找到后继节点
      Node<E> s = successor(node);
      // 用后继节点的值覆盖度为2的节点的值
      node.element = s.element;
      // 要删除的后继节点
      node = s;
    }

    // 删除node节点（node的度必然是0或1）
    Node<E> replacement = node.left != null ? node.left : node.right;
    if (replacement != null) { // node的度为1的节点
      // 更改parent
      replacement.parent = node.parent;
      if (node.parent == null) { // node是度为1的节点，并且是根节点
        root = replacement;
      }
      if (node == node.parent.left) {
        node.parent.left = replacement;
      } else { // node == node.parent.right
        node.parent.right = replacement;
      }
    } else if (node.parent == null) { // node是叶子结点，并且是根节点
      root = null;
    } else { // node是叶子结点，但不是根节点
      if (node == node.parent.right) {
        node.parent.right = null;
      } else { // node == node.parent.left
        node.parent.left = null;
      }
    }

  }

  public boolean contains(E element) {
    return node(element) != null;
  }

  private Node<E> node(E element) {
    Node<E> node = root;
    while (node != null) {
      int cmp = compare(element, node.element);
      if (cmp == 0)
        return node;
      if (cmp > 0) {
        node = node.right;
      } else {
        node = node.left;
      }
    }
    return null;
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
}
