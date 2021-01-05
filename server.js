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
    // this section creates the function that operate from the option selected
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
}