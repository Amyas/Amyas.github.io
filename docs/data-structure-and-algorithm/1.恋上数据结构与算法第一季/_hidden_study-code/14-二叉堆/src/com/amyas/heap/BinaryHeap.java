package com.amyas.heap;

import java.util.Comparator;

@SuppressWarnings("unchecked")
public class BinaryHeap<E> implements Heap<E> {
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

}
