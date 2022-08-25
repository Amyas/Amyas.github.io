package com.amyas.list;

@SuppressWarnings("unchecked")
public class ArrayList<E> extends AbstractList<E> {
  /**
   * 所有的元素
   */
  private E[] elements;

  private static final int DEFAULT_CAPACITY = 10;

  public ArrayList(int capacity) {
    capacity = (capacity < DEFAULT_CAPACITY) ? DEFAULT_CAPACITY : capacity;
    elements = (E[]) new Object[capacity];
  }

  public ArrayList() {
    this(DEFAULT_CAPACITY);
  }

  /**
   * 清空所有元素
   */
  public void clear() {
    for (int i = 0; i < size; i++) {
      elements[i] = null;
    }
    size = 0;
  }

  /**
   * 获取index位置的元素
   * 
   * @param index
   * @return 获取的元素
   */
  public E get(int index) {
    rangeCheck(index);
    return elements[index];
  }

  /**
   * 设置index位置的元素
   * 
   * @param index
   * @param element
   * @return 原来的元素
   */
  public E set(int index, E element) {
    rangeCheck(index);
    E old = elements[index];
    elements[index] = element;
    return old;
  }

  /**
   * 在index位置插入一个元素
   * 
   * @param index
   * @param element
   */
  public void add(int index, E element) {
    rangeCheckForAdd(index);
    ensureCapacity(size + 1);

    for (int i = size - 1; i >= index; i--) {
      elements[i + 1] = elements[i];
    }
    elements[index] = element;
    size++;
  }

  /**
   * 删除index位置的元素
   * 
   * @param index
   * @return
   */
  public E remove(int index) {
    rangeCheck(index);
    E old = elements[index];
    for (int i = index + 1; i <= size - 1; i++) {
      elements[i - 1] = elements[i];
    }
    size--;
    elements[size] = null;

    trim();
    return old;
  }

  /**
   * 查看元素的索引
   * 
   * @param element
   * @return
   */
  public int indexOf(E element) {
    if (element == null) {
      for (int i = 0; i < size; i++) {
        if (elements[i] == null)
          return i;
      }
    } else {
      for (int i = 0; i < size; i++) {
        if (elements[i].equals(element))
          return i;
      }
    }
    return ELEMENT_NOT_FOUND;
  }

  private void ensureCapacity(int capacity) {
    int oldCapacity = elements.length;
    if (oldCapacity >= capacity)
      return;

    // 旧容量的1.5倍，位运算速度快，>> 1 === oldCapacity / 2
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    E[] newElements = (E[]) new Object[newCapacity];
    for (int i = 0; i < size; i++) {
      newElements[i] = elements[i];
    }
    elements = newElements;

    // System.out.println("oldCapacity:" + oldCapacity + "newCapacity:" +
    // newCapacity);
  }

  private void trim() {
    int capacity = elements.length;
    int newCapacity = capacity >> 1;

    // size 大于等于 总容量的一半，总容量小于默认容量，不在缩容
    if (size >= (newCapacity) || capacity <= DEFAULT_CAPACITY)
      return;

    E[] newElements = (E[]) new Object[newCapacity];
    for (int i = 0; i < size; i++) {
      newElements[i] = elements[i];
    }
    elements = newElements;
  }

  @Override
  public String toString() {
    StringBuilder string = new StringBuilder();

    string.append("Size=").append(size).append(", [");
    for (int i = 0; i < size; i++) {
      if (i != 0) {
        string.append(", ");
      }
      string.append(elements[i]);
    }

    string.append("]");

    return string.toString();
  }
}
