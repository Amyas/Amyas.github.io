package 栈;

import java.util.HashMap;
import java.util.Stack;

/**
 * https://leetcode.cn/problems/valid-parentheses/
 */
public class _20_有效的括号 {
  public boolean isValid(String s) {
    int len = s.length();
    Stack<Character> stack = new Stack<>();
    HashMap<Character, Character> map = new HashMap<>();
    map.put('(', ')');
    map.put('{', '}');
    map.put('[', ']');

    for (int i = 0; i < len; i++) {
      char c = s.charAt(i);
      if (map.containsKey(c)) { // 左括号
        stack.push(c);
      } else { // 右括号
        if (stack.isEmpty())
          return false;

        char left = stack.pop();
        if (c != map.get(left))
          return false;
      }
    }
    return stack.isEmpty();
  }

  public boolean isValid1(String s) {
    int len = s.length();
    Stack<Character> stack = new Stack<>();
    for (int i = 0; i < len; i++) {
      char c = s.charAt(i);
      if (c == '(' || c == '{' || c == '[') { // 左括号
        stack.push(c);
      } else { // 右括号
        if (stack.isEmpty())
          return false;

        char left = stack.pop();
        if (left == '(' && c != ')')
          return false;
        if (left == '{' && c != '}')
          return false;
        if (left == '[' && c != ']')
          return false;
      }
    }
    return stack.isEmpty();
  }
}
