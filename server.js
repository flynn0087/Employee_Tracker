// dependicies required for this app
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promMysql = require("promise-mysql");

// create the connection information for the sql database and promise mysql
const conAccess = ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "twinswin",
    database: "employee_trackerDB"
});

//this is the initial mysql connection
let connection = mysql.createConnection(conAccess);  

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

//this function will allow to add a role
function addRole() {
  let departmentName = []
  promMysql.createConnection(conAccess)
  .then((otherConnection) => {
     return Promise.all([
      otherConnection.query("SELECT * FROM department"),
     ]);
  })
  .then(([department]) => {
    for (let i = 0; i < department.length; i++) {
      departmentName.push(department[i].department_name);
    }
    return Promise.all([department]);

  }).then(([department]) => {
    inquirer.prompt([
      {
      type: "input",
      name: "role",
      message: "What role should be added: ",
      },
      {
      type: "input",
      name: "salary",
      message: "What is the salary for this role: ",
      },
      {
      type: "list",
      name: "department",
      message: "What department is this role under: ",
      choices: departmentName
      }
              
    ]).then(answers=>{
      let departmentID;
      for (let i = 0; i < department.length; i++) {
        if (answers.department == department[i].department_name) {
          departmentID = department[i].id;
        }
      } 
      connection.query(
        "INSERT INTO role SET ?",
          {
          title: answers.role,
          salary: answers.salary,
          department_id: departmentID
          },
          function(err) {
          if (err) throw err;
          console.log("The role was sucessfully added!");
          start();
          }
      );
    })
  })   
}; 

//this section is for adding a new employee
function addEmployee() {
  let employeeRole = [];
  let employees = [];

  promMysql.createConnection(conAccess)
  .then((otherConnection) => {
     return Promise.all([
      otherConnection.query("SELECT * FROM role"),
      otherConnection.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS fullName FROM employee ORDER BY fullName ASC")
     ]);
  })
  .then(([role,name]) => {
    for (let i = 0; i < role.length; i++) {
      employeeRole.push(role[i].title);
    }

    for (let i = 0; i < name.length; i++) {
      employees.push(name[i].fullName)
    }

    return Promise.all([role,name]);
  })
  .then(([role,name]) => {
    employees.push('null')
    inquirer.prompt([
      {
      type: "input",
      name: "first",
      message: "First Name: ",
      },
      {
      type: "input",
      name: "last",
      message: "Last Name: ",
      },
      {
      type: "list",
      name: "currentRole",
      message: "Role within the company: ",
      choices: employeeRole
      },
      {
      type: "list",
      name: "manager",
      message: "Name of their manager: ",
      choices: employees 
      }   
    ]).then(answers=> {
      let roleID;
      let managerID = null;

      for (let i = 0; i < role.length; i++) {
        if (answers.currentRole == role[i].title) {
          roleID = role[i].id;
        }
      }
      for (let i = 0; i < name.length; i++) {
        if (answers.manager == name[i].fullName) {
          managerID = name[i].id;
        }
      }

      connection.query(
        "INSERT INTO employee SET ?",
          {
          first_name: answers.first,
          last_name: answers.last,
          role_id: roleID,
          manager_id: managerID
          },
          function(err) {
          if (err) throw err;
          console.log("The employee was successfully added");
          start();
          }
      );
    });
  })   
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
