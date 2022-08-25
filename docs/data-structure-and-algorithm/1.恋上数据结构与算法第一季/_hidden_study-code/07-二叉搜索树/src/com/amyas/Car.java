package com.amyas;

public class Car implements Comparable<Car> {
  private int age;

  public Car(int age) {
    this.age = age;
  }

  public int getAge() {
    return age;
  }

  @Override
  public int compareTo(Car e) {
    // if (age > e.age)
    // return 1;
    // if (age < e.age)
    // return -1;
    // return 0;
    return age - e.age;
  }
}
