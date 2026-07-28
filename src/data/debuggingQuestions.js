export const BUG_CHALLENGES = [
  {
    "id": 1,
    "title": "Array Out of Bounds Exception - User",
    "language": "javascript",
    "description": "This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?",
    "difficulty": "easy",
    "brokenCode": "function sumUsers(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "targetCode": "function sumUsers(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "explanation": "The loop condition used `<=` instead of `<`, causing an out of bounds access."
  },
  {
    "id": 2,
    "title": "Array Out of Bounds Exception - Order",
    "language": "javascript",
    "description": "This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?",
    "difficulty": "easy",
    "brokenCode": "function sumOrders(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "targetCode": "function sumOrders(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "explanation": "The loop condition used `<=` instead of `<`, causing an out of bounds access."
  },
  {
    "id": 3,
    "title": "Array Out of Bounds Exception - Product",
    "language": "javascript",
    "description": "This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?",
    "difficulty": "easy",
    "brokenCode": "function sumProducts(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "targetCode": "function sumProducts(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "explanation": "The loop condition used `<=` instead of `<`, causing an out of bounds access."
  },
  {
    "id": 4,
    "title": "Array Out of Bounds Exception - Item",
    "language": "javascript",
    "description": "This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?",
    "difficulty": "easy",
    "brokenCode": "function sumItems(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "targetCode": "function sumItems(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "explanation": "The loop condition used `<=` instead of `<`, causing an out of bounds access."
  },
  {
    "id": 5,
    "title": "Array Out of Bounds Exception - Data",
    "language": "javascript",
    "description": "This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?",
    "difficulty": "easy",
    "brokenCode": "function sumDatas(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "targetCode": "function sumDatas(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "explanation": "The loop condition used `<=` instead of `<`, causing an out of bounds access."
  },
  {
    "id": 6,
    "title": "Array Out of Bounds Exception - Record",
    "language": "javascript",
    "description": "This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?",
    "difficulty": "easy",
    "brokenCode": "function sumRecords(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "targetCode": "function sumRecords(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "explanation": "The loop condition used `<=` instead of `<`, causing an out of bounds access."
  },
  {
    "id": 7,
    "title": "Array Out of Bounds Exception - Session",
    "language": "javascript",
    "description": "This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?",
    "difficulty": "easy",
    "brokenCode": "function sumSessions(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "targetCode": "function sumSessions(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "explanation": "The loop condition used `<=` instead of `<`, causing an out of bounds access."
  },
  {
    "id": 8,
    "title": "Array Out of Bounds Exception - Account",
    "language": "javascript",
    "description": "This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?",
    "difficulty": "easy",
    "brokenCode": "function sumAccounts(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "targetCode": "function sumAccounts(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "explanation": "The loop condition used `<=` instead of `<`, causing an out of bounds access."
  },
  {
    "id": 9,
    "title": "Array Out of Bounds Exception - Profile",
    "language": "javascript",
    "description": "This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?",
    "difficulty": "easy",
    "brokenCode": "function sumProfiles(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "targetCode": "function sumProfiles(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "explanation": "The loop condition used `<=` instead of `<`, causing an out of bounds access."
  },
  {
    "id": 10,
    "title": "Infinite Loop - User",
    "language": "python",
    "description": "This loop is intended to count down to zero, but it runs forever. What is wrong?",
    "difficulty": "medium",
    "brokenCode": "def countdown_User(n):\n    while n > 0:\n        print(n)\n    return \"Done\"",
    "targetCode": "def countdown_User(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return \"Done\"",
    "explanation": "The loop variable `n` was never decremented inside the loop."
  },
  {
    "id": 11,
    "title": "Infinite Loop - Order",
    "language": "python",
    "description": "This loop is intended to count down to zero, but it runs forever. What is wrong?",
    "difficulty": "medium",
    "brokenCode": "def countdown_Order(n):\n    while n > 0:\n        print(n)\n    return \"Done\"",
    "targetCode": "def countdown_Order(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return \"Done\"",
    "explanation": "The loop variable `n` was never decremented inside the loop."
  },
  {
    "id": 12,
    "title": "Infinite Loop - Product",
    "language": "python",
    "description": "This loop is intended to count down to zero, but it runs forever. What is wrong?",
    "difficulty": "medium",
    "brokenCode": "def countdown_Product(n):\n    while n > 0:\n        print(n)\n    return \"Done\"",
    "targetCode": "def countdown_Product(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return \"Done\"",
    "explanation": "The loop variable `n` was never decremented inside the loop."
  },
  {
    "id": 13,
    "title": "Infinite Loop - Item",
    "language": "python",
    "description": "This loop is intended to count down to zero, but it runs forever. What is wrong?",
    "difficulty": "medium",
    "brokenCode": "def countdown_Item(n):\n    while n > 0:\n        print(n)\n    return \"Done\"",
    "targetCode": "def countdown_Item(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return \"Done\"",
    "explanation": "The loop variable `n` was never decremented inside the loop."
  },
  {
    "id": 14,
    "title": "Infinite Loop - Data",
    "language": "python",
    "description": "This loop is intended to count down to zero, but it runs forever. What is wrong?",
    "difficulty": "medium",
    "brokenCode": "def countdown_Data(n):\n    while n > 0:\n        print(n)\n    return \"Done\"",
    "targetCode": "def countdown_Data(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return \"Done\"",
    "explanation": "The loop variable `n` was never decremented inside the loop."
  },
  {
    "id": 15,
    "title": "Infinite Loop - Record",
    "language": "python",
    "description": "This loop is intended to count down to zero, but it runs forever. What is wrong?",
    "difficulty": "medium",
    "brokenCode": "def countdown_Record(n):\n    while n > 0:\n        print(n)\n    return \"Done\"",
    "targetCode": "def countdown_Record(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return \"Done\"",
    "explanation": "The loop variable `n` was never decremented inside the loop."
  },
  {
    "id": 16,
    "title": "Infinite Loop - Session",
    "language": "python",
    "description": "This loop is intended to count down to zero, but it runs forever. What is wrong?",
    "difficulty": "medium",
    "brokenCode": "def countdown_Session(n):\n    while n > 0:\n        print(n)\n    return \"Done\"",
    "targetCode": "def countdown_Session(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return \"Done\"",
    "explanation": "The loop variable `n` was never decremented inside the loop."
  },
  {
    "id": 17,
    "title": "Infinite Loop - Account",
    "language": "python",
    "description": "This loop is intended to count down to zero, but it runs forever. What is wrong?",
    "difficulty": "medium",
    "brokenCode": "def countdown_Account(n):\n    while n > 0:\n        print(n)\n    return \"Done\"",
    "targetCode": "def countdown_Account(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return \"Done\"",
    "explanation": "The loop variable `n` was never decremented inside the loop."
  },
  {
    "id": 18,
    "title": "Infinite Loop - Profile",
    "language": "python",
    "description": "This loop is intended to count down to zero, but it runs forever. What is wrong?",
    "difficulty": "medium",
    "brokenCode": "def countdown_Profile(n):\n    while n > 0:\n        print(n)\n    return \"Done\"",
    "targetCode": "def countdown_Profile(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return \"Done\"",
    "explanation": "The loop variable `n` was never decremented inside the loop."
  },
  {
    "id": 19,
    "title": "Incorrect Variable Scope - User",
    "language": "javascript",
    "description": "The counter variable is not accumulating properly across iterations.",
    "difficulty": "hard",
    "brokenCode": "function countUsers(items) {\n  for (let i = 0; i < items.length; i++) {\n    let count = 0;\n    count++;\n  }\n  return count;\n}",
    "targetCode": "function countUsers(items) {\n  let count = 0;\n  for (let i = 0; i < items.length; i++) {\n    count++;\n  }\n  return count;\n}",
    "explanation": "The `count` variable was declared inside the loop, resetting it on every iteration."
  },
  {
    "id": 20,
    "title": "Incorrect Variable Scope - Order",
    "language": "javascript",
    "description": "The counter variable is not accumulating properly across iterations.",
    "difficulty": "hard",
    "brokenCode": "function countOrders(items) {\n  for (let i = 0; i < items.length; i++) {\n    let count = 0;\n    count++;\n  }\n  return count;\n}",
    "targetCode": "function countOrders(items) {\n  let count = 0;\n  for (let i = 0; i < items.length; i++) {\n    count++;\n  }\n  return count;\n}",
    "explanation": "The `count` variable was declared inside the loop, resetting it on every iteration."
  },
  {
    "id": 21,
    "title": "Incorrect Variable Scope - Product",
    "language": "javascript",
    "description": "The counter variable is not accumulating properly across iterations.",
    "difficulty": "hard",
    "brokenCode": "function countProducts(items) {\n  for (let i = 0; i < items.length; i++) {\n    let count = 0;\n    count++;\n  }\n  return count;\n}",
    "targetCode": "function countProducts(items) {\n  let count = 0;\n  for (let i = 0; i < items.length; i++) {\n    count++;\n  }\n  return count;\n}",
    "explanation": "The `count` variable was declared inside the loop, resetting it on every iteration."
  },
  {
    "id": 22,
    "title": "Incorrect Variable Scope - Item",
    "language": "javascript",
    "description": "The counter variable is not accumulating properly across iterations.",
    "difficulty": "hard",
    "brokenCode": "function countItems(items) {\n  for (let i = 0; i < items.length; i++) {\n    let count = 0;\n    count++;\n  }\n  return count;\n}",
    "targetCode": "function countItems(items) {\n  let count = 0;\n  for (let i = 0; i < items.length; i++) {\n    count++;\n  }\n  return count;\n}",
    "explanation": "The `count` variable was declared inside the loop, resetting it on every iteration."
  },
  {
    "id": 23,
    "title": "Incorrect Variable Scope - Data",
    "language": "javascript",
    "description": "The counter variable is not accumulating properly across iterations.",
    "difficulty": "hard",
    "brokenCode": "function countDatas(items) {\n  for (let i = 0; i < items.length; i++) {\n    let count = 0;\n    count++;\n  }\n  return count;\n}",
    "targetCode": "function countDatas(items) {\n  let count = 0;\n  for (let i = 0; i < items.length; i++) {\n    count++;\n  }\n  return count;\n}",
    "explanation": "The `count` variable was declared inside the loop, resetting it on every iteration."
  },
  {
    "id": 24,
    "title": "Incorrect Variable Scope - Record",
    "language": "javascript",
    "description": "The counter variable is not accumulating properly across iterations.",
    "difficulty": "hard",
    "brokenCode": "function countRecords(items) {\n  for (let i = 0; i < items.length; i++) {\n    let count = 0;\n    count++;\n  }\n  return count;\n}",
    "targetCode": "function countRecords(items) {\n  let count = 0;\n  for (let i = 0; i < items.length; i++) {\n    count++;\n  }\n  return count;\n}",
    "explanation": "The `count` variable was declared inside the loop, resetting it on every iteration."
  },
  {
    "id": 25,
    "title": "Incorrect Variable Scope - Session",
    "language": "javascript",
    "description": "The counter variable is not accumulating properly across iterations.",
    "difficulty": "hard",
    "brokenCode": "function countSessions(items) {\n  for (let i = 0; i < items.length; i++) {\n    let count = 0;\n    count++;\n  }\n  return count;\n}",
    "targetCode": "function countSessions(items) {\n  let count = 0;\n  for (let i = 0; i < items.length; i++) {\n    count++;\n  }\n  return count;\n}",
    "explanation": "The `count` variable was declared inside the loop, resetting it on every iteration."
  },
  {
    "id": 26,
    "title": "Incorrect Variable Scope - Account",
    "language": "javascript",
    "description": "The counter variable is not accumulating properly across iterations.",
    "difficulty": "hard",
    "brokenCode": "function countAccounts(items) {\n  for (let i = 0; i < items.length; i++) {\n    let count = 0;\n    count++;\n  }\n  return count;\n}",
    "targetCode": "function countAccounts(items) {\n  let count = 0;\n  for (let i = 0; i < items.length; i++) {\n    count++;\n  }\n  return count;\n}",
    "explanation": "The `count` variable was declared inside the loop, resetting it on every iteration."
  },
  {
    "id": 27,
    "title": "Incorrect Variable Scope - Profile",
    "language": "javascript",
    "description": "The counter variable is not accumulating properly across iterations.",
    "difficulty": "hard",
    "brokenCode": "function countProfiles(items) {\n  for (let i = 0; i < items.length; i++) {\n    let count = 0;\n    count++;\n  }\n  return count;\n}",
    "targetCode": "function countProfiles(items) {\n  let count = 0;\n  for (let i = 0; i < items.length; i++) {\n    count++;\n  }\n  return count;\n}",
    "explanation": "The `count` variable was declared inside the loop, resetting it on every iteration."
  },
  {
    "id": 28,
    "title": "Mutable Default Argument - User",
    "language": "python",
    "description": "Appending to the list affects subsequent calls. Fix the default argument.",
    "difficulty": "hard",
    "brokenCode": "def add_User(item, User_list=[]):\n    User_list.append(item)\n    return User_list",
    "targetCode": "def add_User(item, User_list=None):\n    if User_list is None:\n        User_list = []\n    User_list.append(item)\n    return User_list",
    "explanation": "Python evaluates default arguments once. Using `None` and initializing inside the function fixes this."
  },
  {
    "id": 29,
    "title": "Mutable Default Argument - Order",
    "language": "python",
    "description": "Appending to the list affects subsequent calls. Fix the default argument.",
    "difficulty": "hard",
    "brokenCode": "def add_Order(item, Order_list=[]):\n    Order_list.append(item)\n    return Order_list",
    "targetCode": "def add_Order(item, Order_list=None):\n    if Order_list is None:\n        Order_list = []\n    Order_list.append(item)\n    return Order_list",
    "explanation": "Python evaluates default arguments once. Using `None` and initializing inside the function fixes this."
  },
  {
    "id": 30,
    "title": "Mutable Default Argument - Product",
    "language": "python",
    "description": "Appending to the list affects subsequent calls. Fix the default argument.",
    "difficulty": "hard",
    "brokenCode": "def add_Product(item, Product_list=[]):\n    Product_list.append(item)\n    return Product_list",
    "targetCode": "def add_Product(item, Product_list=None):\n    if Product_list is None:\n        Product_list = []\n    Product_list.append(item)\n    return Product_list",
    "explanation": "Python evaluates default arguments once. Using `None` and initializing inside the function fixes this."
  },
  {
    "id": 31,
    "title": "Mutable Default Argument - Item",
    "language": "python",
    "description": "Appending to the list affects subsequent calls. Fix the default argument.",
    "difficulty": "hard",
    "brokenCode": "def add_Item(item, Item_list=[]):\n    Item_list.append(item)\n    return Item_list",
    "targetCode": "def add_Item(item, Item_list=None):\n    if Item_list is None:\n        Item_list = []\n    Item_list.append(item)\n    return Item_list",
    "explanation": "Python evaluates default arguments once. Using `None` and initializing inside the function fixes this."
  },
  {
    "id": 32,
    "title": "Mutable Default Argument - Data",
    "language": "python",
    "description": "Appending to the list affects subsequent calls. Fix the default argument.",
    "difficulty": "hard",
    "brokenCode": "def add_Data(item, Data_list=[]):\n    Data_list.append(item)\n    return Data_list",
    "targetCode": "def add_Data(item, Data_list=None):\n    if Data_list is None:\n        Data_list = []\n    Data_list.append(item)\n    return Data_list",
    "explanation": "Python evaluates default arguments once. Using `None` and initializing inside the function fixes this."
  },
  {
    "id": 33,
    "title": "Mutable Default Argument - Record",
    "language": "python",
    "description": "Appending to the list affects subsequent calls. Fix the default argument.",
    "difficulty": "hard",
    "brokenCode": "def add_Record(item, Record_list=[]):\n    Record_list.append(item)\n    return Record_list",
    "targetCode": "def add_Record(item, Record_list=None):\n    if Record_list is None:\n        Record_list = []\n    Record_list.append(item)\n    return Record_list",
    "explanation": "Python evaluates default arguments once. Using `None` and initializing inside the function fixes this."
  },
  {
    "id": 34,
    "title": "Mutable Default Argument - Session",
    "language": "python",
    "description": "Appending to the list affects subsequent calls. Fix the default argument.",
    "difficulty": "hard",
    "brokenCode": "def add_Session(item, Session_list=[]):\n    Session_list.append(item)\n    return Session_list",
    "targetCode": "def add_Session(item, Session_list=None):\n    if Session_list is None:\n        Session_list = []\n    Session_list.append(item)\n    return Session_list",
    "explanation": "Python evaluates default arguments once. Using `None` and initializing inside the function fixes this."
  },
  {
    "id": 35,
    "title": "Mutable Default Argument - Account",
    "language": "python",
    "description": "Appending to the list affects subsequent calls. Fix the default argument.",
    "difficulty": "hard",
    "brokenCode": "def add_Account(item, Account_list=[]):\n    Account_list.append(item)\n    return Account_list",
    "targetCode": "def add_Account(item, Account_list=None):\n    if Account_list is None:\n        Account_list = []\n    Account_list.append(item)\n    return Account_list",
    "explanation": "Python evaluates default arguments once. Using `None` and initializing inside the function fixes this."
  },
  {
    "id": 36,
    "title": "Mutable Default Argument - Profile",
    "language": "python",
    "description": "Appending to the list affects subsequent calls. Fix the default argument.",
    "difficulty": "hard",
    "brokenCode": "def add_Profile(item, Profile_list=[]):\n    Profile_list.append(item)\n    return Profile_list",
    "targetCode": "def add_Profile(item, Profile_list=None):\n    if Profile_list is None:\n        Profile_list = []\n    Profile_list.append(item)\n    return Profile_list",
    "explanation": "Python evaluates default arguments once. Using `None` and initializing inside the function fixes this."
  },
  {
    "id": 37,
    "title": "Null Reference Exception - User",
    "language": "java",
    "description": "This method throws a NullPointerException when the input string is null.",
    "difficulty": "easy",
    "brokenCode": "public boolean isUserValid(String input) {\n    return input.equals(\"valid\");\n}",
    "targetCode": "public boolean isUserValid(String input) {\n    return \"valid\".equals(input);\n}",
    "explanation": "Calling `.equals` on a potentially null variable causes NPE. Reversing it avoids the exception."
  },
  {
    "id": 38,
    "title": "Null Reference Exception - Order",
    "language": "java",
    "description": "This method throws a NullPointerException when the input string is null.",
    "difficulty": "easy",
    "brokenCode": "public boolean isOrderValid(String input) {\n    return input.equals(\"valid\");\n}",
    "targetCode": "public boolean isOrderValid(String input) {\n    return \"valid\".equals(input);\n}",
    "explanation": "Calling `.equals` on a potentially null variable causes NPE. Reversing it avoids the exception."
  },
  {
    "id": 39,
    "title": "Null Reference Exception - Product",
    "language": "java",
    "description": "This method throws a NullPointerException when the input string is null.",
    "difficulty": "easy",
    "brokenCode": "public boolean isProductValid(String input) {\n    return input.equals(\"valid\");\n}",
    "targetCode": "public boolean isProductValid(String input) {\n    return \"valid\".equals(input);\n}",
    "explanation": "Calling `.equals` on a potentially null variable causes NPE. Reversing it avoids the exception."
  },
  {
    "id": 40,
    "title": "Null Reference Exception - Item",
    "language": "java",
    "description": "This method throws a NullPointerException when the input string is null.",
    "difficulty": "easy",
    "brokenCode": "public boolean isItemValid(String input) {\n    return input.equals(\"valid\");\n}",
    "targetCode": "public boolean isItemValid(String input) {\n    return \"valid\".equals(input);\n}",
    "explanation": "Calling `.equals` on a potentially null variable causes NPE. Reversing it avoids the exception."
  },
  {
    "id": 41,
    "title": "Null Reference Exception - Data",
    "language": "java",
    "description": "This method throws a NullPointerException when the input string is null.",
    "difficulty": "easy",
    "brokenCode": "public boolean isDataValid(String input) {\n    return input.equals(\"valid\");\n}",
    "targetCode": "public boolean isDataValid(String input) {\n    return \"valid\".equals(input);\n}",
    "explanation": "Calling `.equals` on a potentially null variable causes NPE. Reversing it avoids the exception."
  },
  {
    "id": 42,
    "title": "Null Reference Exception - Record",
    "language": "java",
    "description": "This method throws a NullPointerException when the input string is null.",
    "difficulty": "easy",
    "brokenCode": "public boolean isRecordValid(String input) {\n    return input.equals(\"valid\");\n}",
    "targetCode": "public boolean isRecordValid(String input) {\n    return \"valid\".equals(input);\n}",
    "explanation": "Calling `.equals` on a potentially null variable causes NPE. Reversing it avoids the exception."
  },
  {
    "id": 43,
    "title": "Null Reference Exception - Session",
    "language": "java",
    "description": "This method throws a NullPointerException when the input string is null.",
    "difficulty": "easy",
    "brokenCode": "public boolean isSessionValid(String input) {\n    return input.equals(\"valid\");\n}",
    "targetCode": "public boolean isSessionValid(String input) {\n    return \"valid\".equals(input);\n}",
    "explanation": "Calling `.equals` on a potentially null variable causes NPE. Reversing it avoids the exception."
  },
  {
    "id": 44,
    "title": "Null Reference Exception - Account",
    "language": "java",
    "description": "This method throws a NullPointerException when the input string is null.",
    "difficulty": "easy",
    "brokenCode": "public boolean isAccountValid(String input) {\n    return input.equals(\"valid\");\n}",
    "targetCode": "public boolean isAccountValid(String input) {\n    return \"valid\".equals(input);\n}",
    "explanation": "Calling `.equals` on a potentially null variable causes NPE. Reversing it avoids the exception."
  },
  {
    "id": 45,
    "title": "Null Reference Exception - Profile",
    "language": "java",
    "description": "This method throws a NullPointerException when the input string is null.",
    "difficulty": "easy",
    "brokenCode": "public boolean isProfileValid(String input) {\n    return input.equals(\"valid\");\n}",
    "targetCode": "public boolean isProfileValid(String input) {\n    return \"valid\".equals(input);\n}",
    "explanation": "Calling `.equals` on a potentially null variable causes NPE. Reversing it avoids the exception."
  },
  {
    "id": 46,
    "title": "Strict Equality Failure - User",
    "language": "javascript",
    "description": "This function fails to match numbers passed as strings.",
    "difficulty": "medium",
    "brokenCode": "function checkUserId(id) {\n  if (id === 123) return true;\n  return false;\n}",
    "targetCode": "function checkUserId(id) {\n  if (Number(id) === 123) return true;\n  return false;\n}",
    "explanation": "Strict equality `===` checks type. Converting the input to Number ensures the types match."
  },
  {
    "id": 47,
    "title": "Strict Equality Failure - Order",
    "language": "javascript",
    "description": "This function fails to match numbers passed as strings.",
    "difficulty": "medium",
    "brokenCode": "function checkOrderId(id) {\n  if (id === 123) return true;\n  return false;\n}",
    "targetCode": "function checkOrderId(id) {\n  if (Number(id) === 123) return true;\n  return false;\n}",
    "explanation": "Strict equality `===` checks type. Converting the input to Number ensures the types match."
  },
  {
    "id": 48,
    "title": "Strict Equality Failure - Product",
    "language": "javascript",
    "description": "This function fails to match numbers passed as strings.",
    "difficulty": "medium",
    "brokenCode": "function checkProductId(id) {\n  if (id === 123) return true;\n  return false;\n}",
    "targetCode": "function checkProductId(id) {\n  if (Number(id) === 123) return true;\n  return false;\n}",
    "explanation": "Strict equality `===` checks type. Converting the input to Number ensures the types match."
  },
  {
    "id": 49,
    "title": "Strict Equality Failure - Item",
    "language": "javascript",
    "description": "This function fails to match numbers passed as strings.",
    "difficulty": "medium",
    "brokenCode": "function checkItemId(id) {\n  if (id === 123) return true;\n  return false;\n}",
    "targetCode": "function checkItemId(id) {\n  if (Number(id) === 123) return true;\n  return false;\n}",
    "explanation": "Strict equality `===` checks type. Converting the input to Number ensures the types match."
  },
  {
    "id": 50,
    "title": "Strict Equality Failure - Data",
    "language": "javascript",
    "description": "This function fails to match numbers passed as strings.",
    "difficulty": "medium",
    "brokenCode": "function checkDataId(id) {\n  if (id === 123) return true;\n  return false;\n}",
    "targetCode": "function checkDataId(id) {\n  if (Number(id) === 123) return true;\n  return false;\n}",
    "explanation": "Strict equality `===` checks type. Converting the input to Number ensures the types match."
  },
  {
    "id": 51,
    "title": "Strict Equality Failure - Record",
    "language": "javascript",
    "description": "This function fails to match numbers passed as strings.",
    "difficulty": "medium",
    "brokenCode": "function checkRecordId(id) {\n  if (id === 123) return true;\n  return false;\n}",
    "targetCode": "function checkRecordId(id) {\n  if (Number(id) === 123) return true;\n  return false;\n}",
    "explanation": "Strict equality `===` checks type. Converting the input to Number ensures the types match."
  },
  {
    "id": 52,
    "title": "Strict Equality Failure - Session",
    "language": "javascript",
    "description": "This function fails to match numbers passed as strings.",
    "difficulty": "medium",
    "brokenCode": "function checkSessionId(id) {\n  if (id === 123) return true;\n  return false;\n}",
    "targetCode": "function checkSessionId(id) {\n  if (Number(id) === 123) return true;\n  return false;\n}",
    "explanation": "Strict equality `===` checks type. Converting the input to Number ensures the types match."
  },
  {
    "id": 53,
    "title": "Strict Equality Failure - Account",
    "language": "javascript",
    "description": "This function fails to match numbers passed as strings.",
    "difficulty": "medium",
    "brokenCode": "function checkAccountId(id) {\n  if (id === 123) return true;\n  return false;\n}",
    "targetCode": "function checkAccountId(id) {\n  if (Number(id) === 123) return true;\n  return false;\n}",
    "explanation": "Strict equality `===` checks type. Converting the input to Number ensures the types match."
  },
  {
    "id": 54,
    "title": "Strict Equality Failure - Profile",
    "language": "javascript",
    "description": "This function fails to match numbers passed as strings.",
    "difficulty": "medium",
    "brokenCode": "function checkProfileId(id) {\n  if (id === 123) return true;\n  return false;\n}",
    "targetCode": "function checkProfileId(id) {\n  if (Number(id) === 123) return true;\n  return false;\n}",
    "explanation": "Strict equality `===` checks type. Converting the input to Number ensures the types match."
  },
  {
    "id": 55,
    "title": "Dictionary Key Error - User",
    "language": "python",
    "description": "Accessing a missing key causes a KeyError. Fix it to return None instead.",
    "difficulty": "medium",
    "brokenCode": "def get_User_info(data, key):\n    return data[key]",
    "targetCode": "def get_User_info(data, key):\n    return data.get(key)",
    "explanation": "Using `.get()` on a dictionary safely returns `None` instead of throwing an error."
  },
  {
    "id": 56,
    "title": "Dictionary Key Error - Order",
    "language": "python",
    "description": "Accessing a missing key causes a KeyError. Fix it to return None instead.",
    "difficulty": "medium",
    "brokenCode": "def get_Order_info(data, key):\n    return data[key]",
    "targetCode": "def get_Order_info(data, key):\n    return data.get(key)",
    "explanation": "Using `.get()` on a dictionary safely returns `None` instead of throwing an error."
  },
  {
    "id": 57,
    "title": "Dictionary Key Error - Product",
    "language": "python",
    "description": "Accessing a missing key causes a KeyError. Fix it to return None instead.",
    "difficulty": "medium",
    "brokenCode": "def get_Product_info(data, key):\n    return data[key]",
    "targetCode": "def get_Product_info(data, key):\n    return data.get(key)",
    "explanation": "Using `.get()` on a dictionary safely returns `None` instead of throwing an error."
  },
  {
    "id": 58,
    "title": "Dictionary Key Error - Item",
    "language": "python",
    "description": "Accessing a missing key causes a KeyError. Fix it to return None instead.",
    "difficulty": "medium",
    "brokenCode": "def get_Item_info(data, key):\n    return data[key]",
    "targetCode": "def get_Item_info(data, key):\n    return data.get(key)",
    "explanation": "Using `.get()` on a dictionary safely returns `None` instead of throwing an error."
  },
  {
    "id": 59,
    "title": "Dictionary Key Error - Data",
    "language": "python",
    "description": "Accessing a missing key causes a KeyError. Fix it to return None instead.",
    "difficulty": "medium",
    "brokenCode": "def get_Data_info(data, key):\n    return data[key]",
    "targetCode": "def get_Data_info(data, key):\n    return data.get(key)",
    "explanation": "Using `.get()` on a dictionary safely returns `None` instead of throwing an error."
  },
  {
    "id": 60,
    "title": "Dictionary Key Error - Record",
    "language": "python",
    "description": "Accessing a missing key causes a KeyError. Fix it to return None instead.",
    "difficulty": "medium",
    "brokenCode": "def get_Record_info(data, key):\n    return data[key]",
    "targetCode": "def get_Record_info(data, key):\n    return data.get(key)",
    "explanation": "Using `.get()` on a dictionary safely returns `None` instead of throwing an error."
  },
  {
    "id": 61,
    "title": "Dictionary Key Error - Session",
    "language": "python",
    "description": "Accessing a missing key causes a KeyError. Fix it to return None instead.",
    "difficulty": "medium",
    "brokenCode": "def get_Session_info(data, key):\n    return data[key]",
    "targetCode": "def get_Session_info(data, key):\n    return data.get(key)",
    "explanation": "Using `.get()` on a dictionary safely returns `None` instead of throwing an error."
  },
  {
    "id": 62,
    "title": "Dictionary Key Error - Account",
    "language": "python",
    "description": "Accessing a missing key causes a KeyError. Fix it to return None instead.",
    "difficulty": "medium",
    "brokenCode": "def get_Account_info(data, key):\n    return data[key]",
    "targetCode": "def get_Account_info(data, key):\n    return data.get(key)",
    "explanation": "Using `.get()` on a dictionary safely returns `None` instead of throwing an error."
  },
  {
    "id": 63,
    "title": "Dictionary Key Error - Profile",
    "language": "python",
    "description": "Accessing a missing key causes a KeyError. Fix it to return None instead.",
    "difficulty": "medium",
    "brokenCode": "def get_Profile_info(data, key):\n    return data[key]",
    "targetCode": "def get_Profile_info(data, key):\n    return data.get(key)",
    "explanation": "Using `.get()` on a dictionary safely returns `None` instead of throwing an error."
  },
  {
    "id": 64,
    "title": "Missing Return Statement - User",
    "language": "javascript",
    "description": "The map function is returning an array of undefined values.",
    "difficulty": "easy",
    "brokenCode": "const getUserNames = (arr) => {\n  arr.map(item => {\n    item.name;\n  });\n};",
    "targetCode": "const getUserNames = (arr) => {\n  return arr.map(item => {\n    return item.name;\n  });\n};",
    "explanation": "The arrow function had a block body `{}` but no `return` statement."
  },
  {
    "id": 65,
    "title": "Missing Return Statement - Order",
    "language": "javascript",
    "description": "The map function is returning an array of undefined values.",
    "difficulty": "easy",
    "brokenCode": "const getOrderNames = (arr) => {\n  arr.map(item => {\n    item.name;\n  });\n};",
    "targetCode": "const getOrderNames = (arr) => {\n  return arr.map(item => {\n    return item.name;\n  });\n};",
    "explanation": "The arrow function had a block body `{}` but no `return` statement."
  },
  {
    "id": 66,
    "title": "Missing Return Statement - Product",
    "language": "javascript",
    "description": "The map function is returning an array of undefined values.",
    "difficulty": "easy",
    "brokenCode": "const getProductNames = (arr) => {\n  arr.map(item => {\n    item.name;\n  });\n};",
    "targetCode": "const getProductNames = (arr) => {\n  return arr.map(item => {\n    return item.name;\n  });\n};",
    "explanation": "The arrow function had a block body `{}` but no `return` statement."
  },
  {
    "id": 67,
    "title": "Missing Return Statement - Item",
    "language": "javascript",
    "description": "The map function is returning an array of undefined values.",
    "difficulty": "easy",
    "brokenCode": "const getItemNames = (arr) => {\n  arr.map(item => {\n    item.name;\n  });\n};",
    "targetCode": "const getItemNames = (arr) => {\n  return arr.map(item => {\n    return item.name;\n  });\n};",
    "explanation": "The arrow function had a block body `{}` but no `return` statement."
  },
  {
    "id": 68,
    "title": "Missing Return Statement - Data",
    "language": "javascript",
    "description": "The map function is returning an array of undefined values.",
    "difficulty": "easy",
    "brokenCode": "const getDataNames = (arr) => {\n  arr.map(item => {\n    item.name;\n  });\n};",
    "targetCode": "const getDataNames = (arr) => {\n  return arr.map(item => {\n    return item.name;\n  });\n};",
    "explanation": "The arrow function had a block body `{}` but no `return` statement."
  },
  {
    "id": 69,
    "title": "Missing Return Statement - Record",
    "language": "javascript",
    "description": "The map function is returning an array of undefined values.",
    "difficulty": "easy",
    "brokenCode": "const getRecordNames = (arr) => {\n  arr.map(item => {\n    item.name;\n  });\n};",
    "targetCode": "const getRecordNames = (arr) => {\n  return arr.map(item => {\n    return item.name;\n  });\n};",
    "explanation": "The arrow function had a block body `{}` but no `return` statement."
  },
  {
    "id": 70,
    "title": "Missing Return Statement - Session",
    "language": "javascript",
    "description": "The map function is returning an array of undefined values.",
    "difficulty": "easy",
    "brokenCode": "const getSessionNames = (arr) => {\n  arr.map(item => {\n    item.name;\n  });\n};",
    "targetCode": "const getSessionNames = (arr) => {\n  return arr.map(item => {\n    return item.name;\n  });\n};",
    "explanation": "The arrow function had a block body `{}` but no `return` statement."
  },
  {
    "id": 71,
    "title": "Array Out of Bounds Exception - Extra70",
    "language": "javascript",
    "description": "This function is supposed to sum all elements in an array. However, it is throwing an error or returning NaN. Can you find and fix the bug?",
    "difficulty": "easy",
    "brokenCode": "function sumExtra70s(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "targetCode": "function sumExtra70s(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
    "explanation": "The loop condition used `<=` instead of `<`, causing an out of bounds access."
  },
  {
    "id": 72,
    "title": "Infinite Loop - Extra71",
    "language": "python",
    "description": "This loop is intended to count down to zero, but it runs forever. What is wrong?",
    "difficulty": "medium",
    "brokenCode": "def countdown_Extra71(n):\n    while n > 0:\n        print(n)\n    return \"Done\"",
    "targetCode": "def countdown_Extra71(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    return \"Done\"",
    "explanation": "The loop variable `n` was never decremented inside the loop."
  }
];
