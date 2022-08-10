package com.amyas;

public class Main {

	public static void main(String[] args) {
		ArrayList<Person> persons = new ArrayList<>();
		persons.add((new Person(10, "amyas1")));
		persons.add((new Person(11, "amyas2")));
		persons.add((new Person(12, "amyas3")));

		System.out.println(persons);

		ArrayList<Integer> ints = new ArrayList<>();
		ints.add(1);
		ints.add(2);
		ints.add(3);

		System.out.println(ints);
	} 

}
