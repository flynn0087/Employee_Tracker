USE employee_trackerDB;

INSERT INTO department (department_name)
VALUES ("Accounting"), ("Engineering"), ("Human Resources"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 80000.00, 1), ("Controller", 140000.00, 1), ("Junior Developer", 65000.00, 2), ("Senior Developer", 95000.00, 2), ("Lead Developer", 135000.00, 2), ("HR Associate", 50000.00, 3), ("HR Manager", 80000.00, 3), ("Paralegal", 60000.00, 4), ("Lawyer", 100000.00, 4), ("Legal Manager", 150000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Larry", "Johnson", 1, 2), ("Pam", "Smith", 2, NULL), ("Sara", "Thompson", 3, 6), ("Boyd", "Levi", 3, 6), ("Kay", "Berg", 4, 6), ("Jeff", "Timms", 5, NULL), ("Kelly", "Trang", 6, 8), ("Bev", "Hoppy", 7, NULL), ("Tina", "Poppins", 8, 11), ("Jerry", "Steller", 9, 11), ("Clark", "Davis", 10, NULL);