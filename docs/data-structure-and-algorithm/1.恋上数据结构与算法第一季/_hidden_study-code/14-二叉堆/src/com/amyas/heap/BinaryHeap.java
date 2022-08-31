package com.amyas.heap;

import java.util.Comparator;

import com.amyas.printer.BinaryTreeInfo;

@SuppressWarnings("unchecked")
public class BinaryHeap<E> extends AbstractHeap<E> implements BinaryTreeInfo {
	private E[] elements;
	private static final int DEFAULT_CAPACITY = 10;

	public BinaryHeap(Comparator<E> comparator) {
		super(comparator);
		this.elements = (E[]) new Object[DEFAULT_CAPACITY];
	}

	public BinaryHeap() {
		this(null);
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
		emptyCheck();

		int lastIndex = --size;
		E root = elements[0];

		elements[0] = elements[lastIndex];
		elements[lastIndex] = null;
		siftDown(0);

		return root;
	}

	@Override
	public E replace(E element) {
		elementNotNullCheck(element);

		E root = null;

		if (size == 0) {
			elements[0] = element;
			size++;
		} else {
			root = elements[0];
			elements[0] = element;
			siftDown(0);
		}

		return root;
	}

	private void siftDown(int index) {
		E element = elements[index];
		// 第一个叶子结点的索引 == 非叶子结点的数量
		// 非叶子结点的数量 = n1 + n2 = floor(n / 2) = ceiling((n - 1) / 2)
		// 非叶子结点的数量 = 叶子结点第一个的索引
		// index < 第一个叶子结点的索引
		int half = size >> 1;
		while (index < half) { // 必须保证index是非叶子结点
			// index的节点有两种情况
			// 1.只有左子结点
			// 2.同时有左右子结点

			// 默认为左子结点进行比较
			int childIndex = (index << 1) + 1; // 2i + 1
			E child = elements[childIndex];

			// 右子结点
			int rightIndex = childIndex + 1; // 2i + 2

			// 选出左右子结点最大的那个
			// 证明右子结点存在，并且右边比左边大
			if (rightIndex < size && compare(elements[rightIndex], child) > 0) {
				child = elements[childIndex = rightIndex];
			}

			if (compare(element, child) >= 0) {
				break;
			}

			// 将子结点存放到index位置
			elements[index] = child;

			index = childIndex;
		}

		elements[index] = element;
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
				break;
			}

			// 交换 parent、element
			elements[index] = parent;

			index = parentIndex;
		}
		elements[index] = element;
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
