package com.amyas;

public class Main {

	public static void main(String[] args) {
		int array[] = new int[] { 11, 22, 33 };

		ArrayList list = new ArrayList();
		// list.get(0);

		list.add(1);
		list.add(2);
		list.add(3);
		list.add(4);

		// list.remove(0);
		// list.remove(list.size() - 1);
		// list.remove(3);

		list.add(0, 100);
		list.add(5, 100);
		list.add(list.size(), 200);

		list.set(3, 80);

		System.out.println(list);
	}

}
