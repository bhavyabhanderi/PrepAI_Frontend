const fs = require('fs');
const path = require('path');

const templates = [
  {
    title: 'Array Out of Bounds Exception',
    language: 'javascript',
    difficulty: 'easy',
    description: 'This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?',
    brokenCode: (v1) => 'function sum' + v1 + 's(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}',
    targetCode: (v1) => 'function sum' + v1 + 's(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}',
    explanation: 'The loop condition used `<=` instead of `<`, causing an out of bounds access.'
  },
  {
    title: 'Infinite Loop',
    language: 'python',
    difficulty: 'medium',
    description: 'This loop is intended to count down to zero, but it runs forever. What is wrong?',
    brokenCode: (v1) => 'def countdown_' + v1 + '(n):\n    while n > 0:\n        print(n)\n    return "Done"',
    targetCode: (v1) => 'def countdown_' + v1 + '(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return "Done"',
    explanation: 'The loop variable `n` was never decremented inside the loop.'
  },
  {
    title: 'Incorrect Variable Scope',
    language: 'javascript',
    difficulty: 'hard',
    description: 'The counter variable is not accumulating properly across iterations.',
    brokenCode: (v1) => 'function count' + v1 + 's(items) {\n  for (let i = 0; i < items.length; i++) {\n    let count = 0;\n    count++;\n  }\n  return count;\n}',
    targetCode: (v1) => 'function count' + v1 + 's(items) {\n  let count = 0;\n  for (let i = 0; i < items.length; i++) {\n    count++;\n  }\n  return count;\n}',
    explanation: 'The `count` variable was declared inside the loop, resetting it on every iteration.'
  },
  {
    title: 'Mutable Default Argument',
    language: 'python',
    difficulty: 'hard',
    description: 'Appending to the list affects subsequent calls. Fix the default argument.',
    brokenCode: (v1) => 'def add_' + v1 + '(item, ' + v1 + '_list=[]):\n    ' + v1 + '_list.append(item)\n    return ' + v1 + '_list',
    targetCode: (v1) => 'def add_' + v1 + '(item, ' + v1 + '_list=None):\n    if ' + v1 + '_list is None:\n        ' + v1 + '_list = []\n    ' + v1 + '_list.append(item)\n    return ' + v1 + '_list',
    explanation: 'Python evaluates default arguments once. Using `None` and initializing inside the function fixes this.'
  },
  {
    title: 'Null Reference Exception',
    language: 'java',
    difficulty: 'easy',
    description: 'This method throws a NullPointerException when the input string is null.',
    brokenCode: (v1) => 'public boolean is' + v1 + 'Valid(String input) {\n    return input.equals("valid");\n}',
    targetCode: (v1) => 'public boolean is' + v1 + 'Valid(String input) {\n    return "valid".equals(input);\n}',
    explanation: 'Calling `.equals` on a potentially null variable causes NPE. Reversing it avoids the exception.'
  },
  {
    title: 'Strict Equality Failure',
    language: 'javascript',
    difficulty: 'medium',
    description: 'This function fails to match numbers passed as strings.',
    brokenCode: (v1) => 'function check' + v1 + 'Id(id) {\n  if (id === 123) return true;\n  return false;\n}',
    targetCode: (v1) => 'function check' + v1 + 'Id(id) {\n  if (Number(id) === 123) return true;\n  return false;\n}',
    explanation: 'Strict equality `===` checks type. Converting the input to Number ensures the types match.'
  },
  {
    title: 'Dictionary Key Error',
    language: 'python',
    difficulty: 'medium',
    description: 'Accessing a missing key causes a KeyError. Fix it to return None instead.',
    brokenCode: (v1) => 'def get_' + v1 + '_info(data, key):\n    return data[key]',
    targetCode: (v1) => 'def get_' + v1 + '_info(data, key):\n    return data.get(key)',
    explanation: 'Using `.get()` on a dictionary safely returns `None` instead of throwing an error.'
  },
  {
    title: 'Missing Return Statement',
    language: 'javascript',
    difficulty: 'easy',
    description: 'The map function is returning an array of undefined values.',
    brokenCode: (v1) => 'const get' + v1 + 'Names = (arr) => {\n  arr.map(item => {\n    item.name;\n  });\n};',
    targetCode: (v1) => 'const get' + v1 + 'Names = (arr) => {\n  return arr.map(item => {\n    return item.name;\n  });\n};',
    explanation: 'The arrow function had a block body `{}` but no `return` statement.'
  },
  {
    title: 'List Index Out Of Range',
    language: 'python',
    difficulty: 'medium',
    description: 'This function tries to access the last element but fails if the list is empty.',
    brokenCode: (v1) => 'def get_last_' + v1 + '(items):\n    return items[len(items)]',
    targetCode: (v1) => 'def get_last_' + v1 + '(items):\n    if not items: return None\n    return items[-1]',
    explanation: 'List indices are 0-based, so `len(items)` is out of bounds. Using `-1` is pythonic.'
  },
  {
    title: 'Concurrent Modification',
    language: 'java',
    difficulty: 'hard',
    description: 'Removing elements from a list while iterating over it throws an exception.',
    brokenCode: (v1) => 'public void remove' + v1 + 's(List<String> list) {\n    for (String s : list) {\n        if (s.isEmpty()) list.remove(s);\n    }\n}',
    targetCode: (v1) => 'public void remove' + v1 + 's(List<String> list) {\n    list.removeIf(String::isEmpty);\n}',
    explanation: 'You cannot modify a collection while iterating it using an enhanced for-loop.'
  }
];

const variables = ['User', 'Order', 'Product', 'Item', 'Data', 'Record', 'Session', 'Account', 'Profile'];

const generated = [];
let idCounter = 1;

for (const tmpl of templates) {
  for (const v1 of variables) {
    if (idCounter > 70) break;
    generated.push({
      id: idCounter,
      title: tmpl.title + ' - ' + v1,
      language: tmpl.language,
      description: tmpl.description,
      difficulty: tmpl.difficulty,
      brokenCode: tmpl.brokenCode(v1),
      targetCode: tmpl.targetCode(v1),
      explanation: tmpl.explanation
    });
    idCounter++;
  }
}

while(generated.length < 72) {
   let idx = generated.length % templates.length;
   let tmpl = templates[idx];
   let v1 = "Extra" + generated.length;
   generated.push({
      id: idCounter,
      title: tmpl.title + ' - ' + v1,
      language: tmpl.language,
      description: tmpl.description,
      difficulty: tmpl.difficulty,
      brokenCode: tmpl.brokenCode(v1),
      targetCode: tmpl.targetCode(v1),
      explanation: tmpl.explanation
    });
    idCounter++;
}

const fileContent = "export const BUG_CHALLENGES = " + JSON.stringify(generated, null, 2) + ";\n";

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'debuggingQuestions.js'), fileContent);
console.log('Successfully generated 50+ debugging challenges!');
