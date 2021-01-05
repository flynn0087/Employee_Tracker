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
