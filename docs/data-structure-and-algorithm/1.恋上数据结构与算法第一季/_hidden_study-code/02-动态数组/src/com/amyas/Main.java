package com.amyas;

public class Main {

	public static void main(String[] args) {
		ArrayList<Person> persons = new ArrayList<>();
		persons.add((new Person(10, "amyas1")));
		persons.add((new Person(11, "amyas2")));
		persons.add((new Person(12, "amyas3")));
		persons.clear();

		// 提醒JMV垃圾回收
		System.gc();
	}

}
