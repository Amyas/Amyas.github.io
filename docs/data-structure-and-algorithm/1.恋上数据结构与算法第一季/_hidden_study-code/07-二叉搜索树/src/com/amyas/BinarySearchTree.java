package com.amyas;

import java.lang.Comparable;
import java.util.LinkedList;
import java.util.Queue;

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

  public void preorder(Visitor<E> visitor) {
    if (visitor == null)
      return;
    preorder(root, visitor);
  }

  private void preorder(Node<E> node, Visitor<E> visitor) {
    if (node == null || visitor.stop)
      return;

    visitor.stop = visitor.visit(node.element);
    preorder(node.left, visitor);
    preorder(node.right, visitor);
  }

  public void inorder(Visitor<E> visitor) {
    if (visitor == null)
      return;
    inorder(root, visitor);
  }

  private void inorder(Node<E> node, Visitor<E> visitor) {
    if (node == null || visitor.stop)
      return;

    inorder(node.left, visitor);
    if (visitor.stop)
      return;
    visitor.stop = visitor.visit(node.element);
    inorder(node.right, visitor);
  }

  public void postorder(Visitor<E> visitor) {
    if (visitor == null)
      return;
    postorder(root, visitor);
  }

  private void postorder(Node<E> node, Visitor<E> visitor) {
    if (node == null || visitor.stop)
      return;

    postorder(node.left, visitor);
    postorder(node.right, visitor);
    if (visitor.stop)
      return;
    visitor.stop = visitor.visit(node.element);
  }

  public void levelOrder(Visitor<E> visitor) {
    if (root == null || visitor == null)
      return;

    Queue<Node<E>> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
      Node<E> node = queue.poll();
      if (visitor.visit(node.element)) {
        return;
      }
      if (node.left != null) {
        queue.offer(node.left);
      }
      if (node.right != null) {
        queue.offer(node.right);
      }
    }
  }

  public static abstract class Visitor<E> {
    boolean stop;

    abstract boolean visit(E element);
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

  public void preorderTraversal() {
    preorderTraversal(root);
  }

  private void preorderTraversal(Node<E> node) {
    if (node == null)
      return;
    System.out.println(node.element);
    preorderTraversal(node.left);
    preorderTraversal(node.right);
  }

  public void inorderTraversal() {
    inorderTraversal(root);
  }

  private void inorderTraversal(Node<E> node) {
    if (node == null)
      return;
    inorderTraversal(node.left);
    System.out.println(node.element);
    inorderTraversal(node.right);
  }

  public void postorderTraversal() {
    postorderTraversal(root);
  }

  private void postorderTraversal(Node<E> node) {
    if (node == null)
      return;
    postorderTraversal(node.left);
    postorderTraversal(node.right);
    System.out.println(node.element);
  }

  public void levelOrderTraversal() {
    if (root == null)
      return;
    Queue<Node<E>> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
      Node<E> node = queue.poll();
      System.out.println(node.element);
      if (node.left != null) {
        queue.offer(node.left);
      }
      if (node.right != null) {
        queue.offer(node.right);
      }
    }
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

  public int height() {
    // 递归遍历法
    // return height(root);

    // 非递归遍历法，层序遍历
    if (root == null)
      return 0;
    Queue<Node<E>> queue = new LinkedList<>();
    queue.offer(root);
    // 树的高度
    int height = 0;
    // 每一层元素数量
    int levelSize = 1;

    while (!queue.isEmpty()) {
      Node<E> node = queue.poll();
      levelSize--;

      if (node.left != null) {
        queue.offer(node.left);
      }
      if (node.right != null) {
        queue.offer(node.right);
      }

      if (levelSize == 0) {
        levelSize = queue.size();
        height++;
      }
    }

    return height;
  }

  private int height(Node<E> node) {
    if (node == null)
      return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    toString(root, sb, "");
    return sb.toString();
  }

  private void toString(Node<E> node, StringBuilder sb, String prefix) {
    if (node == null)
      return;

    sb.append(prefix).append(node.element).append("\n");
    toString(node.left, sb, prefix + "【L】");
    toString(node.right, sb, prefix + "【R】");
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
