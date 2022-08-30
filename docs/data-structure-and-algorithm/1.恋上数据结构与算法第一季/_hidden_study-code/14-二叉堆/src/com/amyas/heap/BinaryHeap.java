package com.amyas.heap;

import java.util.Comparator;

import com.amyas.printer.BinaryTreeInfo;

@SuppressWarnings("unchecked")
public class BinaryHeap<E> implements Heap<E>, BinaryTreeInfo {
	private E[] elements;
	private int size;
	private Comparator<E> comparator;
	private static final int DEFAULT_CAPACITY = 10;

	public BinaryHeap(Comparator<E> comparator) {
		this.comparator = comparator;
		this.elements = (E[]) new Object[DEFAULT_CAPACITY];
	}

	public BinaryHeap() {
		this(null);
	}

	@Override
	public int size() {
		return size;
	}

	@Override
	public boolean isEmpty() {
		return size == 0;
	}

	@Override
	public void clear() {
		for (int i = 0; i < size; i++) {
			elements[i] = null;
		}
		size = 0;
	}

	@Override
	public void add(E element) {
		elementNotNullCheck(element);
		ensureCapacity(size + 1);

		elements[size++] = element;
		siftUp(size - 1);
	}

	@Override
	public E get() {
		emptyCheck();
		return elements[0];
	}

	@Override
	public E remove() {
		return null;
	}

	@Override
	public E replace(E element) {
		return null;
	}

	/**
	 * 让index位置的元素上滤
	 * 
	 * @param index
	 */
	private void siftUp(int index) {
		E element = elements[index];

		while (index > 0) {
			int parentIndex = (index - 1) >> 1; // (index - 1) / 2 向下取整
			E parent = elements[parentIndex];
			if (compare(element, parent) <= 0) { // 当前插入的元素 <= 父元素
				return;
			}

			// 交换 parent、element
			E tmp = elements[index];
			elements[index] = elements[parentIndex];
			elements[parentIndex] = tmp;
			index = parentIndex;
		}
	}

	private int compare(E e1, E e2) {
		return comparator != null ? comparator.compare(e1, e2) : ((Comparable<E>) e1).compareTo(e2);
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

	private void emptyCheck() {
		if (size == 0) {
			throw new IndexOutOfBoundsException("Heap is empty");
		}
	}

	private void elementNotNullCheck(E element) {
		if (element == null) {
			throw new IllegalArgumentException("element must not be null");
		}
	}

	@Override
	public Object root() {
		return 0;
	}

	@Override
	public Object left(Object node) {
		Integer index = (Integer) node;
		index = (index << 1) + 1; // 2 * index + 1;
		return index >= size ? null : index;
	}

	@Override
	public Object right(Object node) {
		Integer index = (Integer) node;
		index = (index << 1) + 2; // 2 * index + 2;
		return index >= size ? null : index;
	}

	@Override
	public Object string(Object node) {
		Integer index = (Integer) node;
		return elements[index];
	}

}
