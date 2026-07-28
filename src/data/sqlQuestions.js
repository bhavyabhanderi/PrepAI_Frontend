export const SQL_QUESTIONS = [
  {
    id: 1,
    difficulty: "easy",
    question: "Write a query to find the total number of orders for each user, sorted by highest orders first.",
    hint: "Assume there are two tables available: users and orders. You can assume the users table has an id and name, and the orders table has an id, user_id, and amount.",
    tables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false },
          { name: "email", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false }
        ]
      },
      {
        name: "orders",
        columns: [
          { name: "id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "user_id", type: "INT", isPrimaryKey: false, isForeignKey: true },
          { name: "amount", type: "DECIMAL", isPrimaryKey: false, isForeignKey: false }
        ]
      }
    ],
    mockResults: {
      columns: ['id', 'name', 'total_orders'],
      rows: [
        [1, 'Alice Smith', 12],
        [2, 'Bob Johnson', 8],
        [3, 'Charlie Davis', 5],
        [4, 'Diana Prince', 3],
        [5, 'Evan Wright', 0]
      ],
      executionTime: '15ms',
      optimizationScore: 85,
      feedback: 'Good use of LEFT JOIN. However, ensure there is an index on orders(user_id) to speed up this query on large datasets.'
    }
  },
  {
    id: 2,
    difficulty: "medium",
    question: "Write a query to fetch the names of users who have not placed any orders.",
    hint: "Use a LEFT JOIN between users and orders, and filter for rows where the order id is NULL. Alternatively, use NOT EXISTS or NOT IN.",
    tables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false },
          { name: "email", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false }
        ]
      },
      {
        name: "orders",
        columns: [
          { name: "id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "user_id", type: "INT", isPrimaryKey: false, isForeignKey: true },
          { name: "amount", type: "DECIMAL", isPrimaryKey: false, isForeignKey: false }
        ]
      }
    ],
    mockResults: {
      columns: ['name'],
      rows: [
        ['Evan Wright']
      ],
      executionTime: '8ms',
      optimizationScore: 92,
      feedback: 'Excellent use of NOT EXISTS or LEFT JOIN with NULL check. This is an optimal way to find missing relationships.'
    }
  },
  {
    id: 3,
    difficulty: "easy",
    question: "Write a query to calculate the average order amount per user.",
    hint: "Use the AVG() aggregate function combined with a GROUP BY clause on the user's name or ID.",
    tables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false },
          { name: "email", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false }
        ]
      },
      {
        name: "orders",
        columns: [
          { name: "id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "user_id", type: "INT", isPrimaryKey: false, isForeignKey: true },
          { name: "amount", type: "DECIMAL", isPrimaryKey: false, isForeignKey: false }
        ]
      }
    ],
    mockResults: {
      columns: ['name', 'avg_order_amount'],
      rows: [
        ['Alice Smith', 150.50],
        ['Bob Johnson', 120.00],
        ['Charlie Davis', 95.00],
        ['Diana Prince', 45.25],
        ['Evan Wright', 0.00]
      ],
      executionTime: '12ms',
      optimizationScore: 88,
      feedback: 'Using AVG() with GROUP BY is correct. Consider rounding the average to 2 decimal places for better presentation.'
    }
  },
  {
    id: 4,
    difficulty: "hard",
    question: "Find all employees whose salary is greater than the average salary of their department.",
    hint: "You will need to use a subquery to calculate the average salary per department and join or correlate it with the main query.",
    tables: [
      {
        name: "employees",
        columns: [
          { name: "emp_id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false },
          { name: "salary", type: "DECIMAL", isPrimaryKey: false, isForeignKey: false },
          { name: "dept_id", type: "INT", isPrimaryKey: false, isForeignKey: true }
        ]
      },
      {
        name: "departments",
        columns: [
          { name: "dept_id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "dept_name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false }
        ]
      }
    ],
    mockResults: {
      columns: ['name', 'salary', 'dept_name'],
      rows: [
        ['John Doe', 85000, 'Engineering'],
        ['Jane Smith', 92000, 'Marketing'],
        ['Sam Wilson', 105000, 'Sales']
      ],
      executionTime: '22ms',
      optimizationScore: 80,
      feedback: 'A correlated subquery works, but using Window Functions like AVG(salary) OVER(PARTITION BY dept_id) is often much more performant.'
    }
  },
  {
    id: 5,
    difficulty: "hard",
    question: "Write a query to find the top 3 highest earning employees in each department.",
    hint: "A Window Function is best here. Consider using DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC).",
    tables: [
      {
        name: "employees",
        columns: [
          { name: "emp_id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false },
          { name: "salary", type: "DECIMAL", isPrimaryKey: false, isForeignKey: false },
          { name: "dept_id", type: "INT", isPrimaryKey: false, isForeignKey: true }
        ]
      },
      {
        name: "departments",
        columns: [
          { name: "dept_id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "dept_name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false }
        ]
      }
    ],
    mockResults: {
      columns: ['dept_name', 'name', 'salary', 'rank'],
      rows: [
        ['Engineering', 'Mike Taylor', 120000, 1],
        ['Engineering', 'John Doe', 85000, 2],
        ['Engineering', 'Sarah Lee', 82000, 3],
        ['Marketing', 'Jane Smith', 92000, 1],
        ['Marketing', 'Anna Cole', 88000, 2],
        ['Marketing', 'Tom Hardy', 85000, 3]
      ],
      executionTime: '18ms',
      optimizationScore: 95,
      feedback: 'Great use of Window Functions. DENSE_RANK() correctly handles ties in salaries.'
    }
  },
  {
    id: 6,
    difficulty: "medium",
    question: "Find the names of students who are enrolled in more than 3 courses.",
    hint: "Use GROUP BY student_id and filter the grouped results using the HAVING clause.",
    tables: [
      {
        name: "students",
        columns: [
          { name: "student_id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false }
        ]
      },
      {
        name: "enrollments",
        columns: [
          { name: "student_id", type: "INT", isPrimaryKey: false, isForeignKey: true },
          { name: "course_id", type: "INT", isPrimaryKey: false, isForeignKey: true }
        ]
      }
    ],
    mockResults: {
      columns: ['name', 'course_count'],
      rows: [
        ['Michael Scott', 5],
        ['Pam Beesly', 4]
      ],
      executionTime: '9ms',
      optimizationScore: 90,
      feedback: 'Good use of the HAVING clause to filter aggregate results.'
    }
  },
  {
    id: 7,
    difficulty: "easy",
    question: "List all products that have never been ordered.",
    hint: "This is a classic 'find non-matching rows' problem. Use a LEFT JOIN from products to order_details and filter where order_id IS NULL.",
    tables: [
      {
        name: "products",
        columns: [
          { name: "product_id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "product_name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false }
        ]
      },
      {
        name: "order_details",
        columns: [
          { name: "order_id", type: "INT", isPrimaryKey: false, isForeignKey: true },
          { name: "product_id", type: "INT", isPrimaryKey: false, isForeignKey: true },
          { name: "quantity", type: "INT", isPrimaryKey: false, isForeignKey: false }
        ]
      }
    ],
    mockResults: {
      columns: ['product_name'],
      rows: [
        ['Vintage Lamp'],
        ['Cassette Player']
      ],
      executionTime: '7ms',
      optimizationScore: 92,
      feedback: 'Perfect! Using a LEFT JOIN is standard and efficient for finding missing records.'
    }
  },
  {
    id: 8,
    difficulty: "medium",
    question: "Find the month with the highest total sales.",
    hint: "Extract the month from the order_date, SUM the amounts, GROUP BY the month, and ORDER BY the sum descending.",
    tables: [
      {
        name: "sales",
        columns: [
          { name: "sale_id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "amount", type: "DECIMAL", isPrimaryKey: false, isForeignKey: false },
          { name: "sale_date", type: "DATE", isPrimaryKey: false, isForeignKey: false }
        ]
      }
    ],
    mockResults: {
      columns: ['sale_month', 'total_sales'],
      rows: [
        ['November', 450000.00]
      ],
      executionTime: '11ms',
      optimizationScore: 86,
      feedback: 'Good job using date extraction functions. Note that date functions can vary heavily between SQL dialects (MySQL vs PostgreSQL).'
    }
  },
  {
    id: 9,
    difficulty: "hard",
    question: "Write a query to get the manager name for each employee. If an employee doesn't have a manager, show 'Top Level'.",
    hint: "Use a SELF JOIN on the employees table and the COALESCE() or IFNULL() function to handle the default string.",
    tables: [
      {
        name: "employees",
        columns: [
          { name: "emp_id", type: "INT", isPrimaryKey: true, isForeignKey: false },
          { name: "name", type: "VARCHAR", isPrimaryKey: false, isForeignKey: false },
          { name: "manager_id", type: "INT", isPrimaryKey: false, isForeignKey: true }
        ]
      }
    ],
    mockResults: {
      columns: ['employee_name', 'manager_name'],
      rows: [
        ['David Wallace', 'Top Level'],
        ['Michael Scott', 'David Wallace'],
        ['Jim Halpert', 'Michael Scott'],
        ['Dwight Schrute', 'Michael Scott']
      ],
      executionTime: '10ms',
      optimizationScore: 89,
      feedback: 'Self joins can be tricky. COALESCE() is the standard and safest way to handle NULL replacements.'
    }
  },
  {
    id: 10,
    difficulty: "medium",
    question: "Calculate the cumulative sum of sales by date.",
    hint: "Use a Window Function: SUM(amount) OVER(ORDER BY sale_date).",
    tables: [
      {
        name: "sales",
        columns: [
          { name: "sale_date", type: "DATE", isPrimaryKey: false, isForeignKey: false },
          { name: "amount", type: "DECIMAL", isPrimaryKey: false, isForeignKey: false }
        ]
      }
    ],
    mockResults: {
      columns: ['sale_date', 'amount', 'cumulative_sales'],
      rows: [
        ['2023-01-01', 500, 500],
        ['2023-01-02', 200, 700],
        ['2023-01-03', 300, 1000],
        ['2023-01-04', 150, 1150]
      ],
      executionTime: '16ms',
      optimizationScore: 94,
      feedback: 'Window functions are perfect for running totals. Excellent work.'
    }
  }
];
