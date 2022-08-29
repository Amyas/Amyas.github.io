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

    public boolean isLeaf() {
      return left == null && right == null;
    }

    public boolean hasTwoChildren() {
      return left != null && right != null;
    }

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
    remove(node(element));
  }

  public boolean contains(E element) {
    return false;
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

  public boolean isComplete() {
    if (root == null) {
      return false;
    }

    Queue<Node<E>> queue = new LinkedList<>();
    queue.offer(root);

    boolean leaf = false;
    while (!queue.isEmpty()) {
      Node<E> node = queue.poll();
      if (leaf && !node.isLeaf()) {
        return false;
      }

      if (node.left != null) {
        queue.offer(node.left);
      } else if (node.right != null) {
        return false;
      }
      if (node.right != null) {
        queue.offer(node.right);
      } else {
        leaf = true;
      }
    }

    return true;
  }

  private Node<E> predecessor(Node<E> node) {
    if (node == null) {
      return null;
    }
    Node<E> p = node.left;

    // 前驱节点在左子树当中(left.right.right.right....)
    if (node.left != null) {
      while (p.right != null) {
        p = p.right;
      }
      return p;
    }

    // 从父节点、祖父节点中寻找前驱节点
    while (node.parent != null && node == node.parent.left) {
      node = node.parent;
    }

    // node.parent == null
    // node == node.parent.right
    return node.parent;
  }

  private Node<E> successor(Node<E> node) {
    if (node == null) {
      return null;
    }
    Node<E> s = node.right;
    if (node.right != null) {
      while (s.left != null) {
        s = s.left;
      }
      return s;
    }

    while (node.parent != null && node == node.parent.right) {
      node = node.parent;
    }

    return node.parent;
  }

  // public boolean isComplete() {
  // if (root == null) {
  // return false;
  // }

  // Queue<Node<E>> queue = new LinkedList<>();
  // queue.offer(root);

  // boolean leaf = false;
  // while (!queue.isEmpty()) {
  // Node<E> node = queue.poll();
  // if (leaf && !node.isLeaf()) {
  // return false;
  // }

  // if (node.hasTwoChildren()) {
  // queue.offer(node.left);
  // queue.offer(node.right);
  // } else if (node.left == null && node.right != null) {
  // return false;
  // } else {
  // // 后面遍历的节点都必须是叶子结点
  // leaf = true;
  // if (node.left != null) {
  // queue.offer(node.left);
  // }
  // }
  // }

  // return true;
  // }

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
