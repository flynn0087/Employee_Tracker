// dependicies required for this app
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "twinswin",
    database: "employee_trackerDB"
  });

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    start();
});

//this create the inquirer prompt to figure out which option to do
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a department",
        "Add a role",
        "Add an employee",
        "View all departments",
        "View all roles",
        "View all employees",
        "Update employee role",
        "Exit"
      ]
    })
    // this section creates the functions that operate from the option selected
    .then(function(answer) {
      switch (answer.action) {
      case "Add a department":
        addDepartment();
        break;

      case "Add a role":
        addRole();
        break;
        
      case "Add an employee":
        addEmployee();
        break;
        
      case "View all departments":
        viewDepartments();
        break;
          
      case "View all roles":
        viewRoles();
        break;
            
      case "View all employees":
        viewEmployees();
        break;
              
      case "Update an employee role":
        updateRole();
        break;
                
      case "Exit":
        connection.end();
        break;         
      }
    });
};

//this function will allow you to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      message: "What is the name of the department you would like to add?"
    })
    .then(function(answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.newDepartment
        },
        function (err) {
          if (err) throw err;
          console.log("The department was sucessfully added!");
          start()
        }
      );
    });
};

//this function allows viewing by department including a salary total for the department
function viewDepartments() {
  connection.query("SELECT department.id, department.department_name, SUM(role.salary) AS expense FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.department_name", function(err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
};

//this function allows you to view all the roles
function viewRoles() {
  connection.query("SELECT role.id, role.title, department.department_name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id", function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
};

//this function allows you to view all the employees
function viewEmployees() {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee LEFT JOIN role on role.id = employee.role_id", function (err, results) {
    if (err) throw err;
    console.table(results);
    start();
  });
};
