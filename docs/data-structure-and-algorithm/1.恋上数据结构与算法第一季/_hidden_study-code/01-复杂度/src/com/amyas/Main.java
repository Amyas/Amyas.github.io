package com.amyas;

public class Main {
	
	public static int fib1(int n) {
		if(n <= 1) return n;
		return fib1(n - 1) + fib1(n - 2);
	}
	
	private static int fib2(int n) {
		if(n <= 1) return n;
		
		int first = 0;
		int second = 1;
		for(int i = 0; i < n - 1; i++) {
			int sum = first + second;
			first = second;
			second = sum;
		}
		
		return second;
	}

	public static void main(String[] args) {
		int n = 45;
		
		TimeTool.test("fib1", new TimeTool.Task() {
			@Override
			public void execute() {
				System.out.println(fib1(n));
			}
		});
		TimeTool.test("fib2", new TimeTool.Task() {
			@Override
			public void execute() {
				System.out.println(fib2(n));
			}
		});

	}

}
