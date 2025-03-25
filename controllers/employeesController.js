const data = {
  employees: require('../models/employees.json'),
  setEmployees: function(data) {this.employees = data;},
};

const getEmployees = (req, res) => {
  return res.status(200).json(data.employees);
};

const createEmployee = (req, res) => {
  //Validate data
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({'message': 'Name and Email are required'});
  }

  //Create employee
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    name: req.body.name,
    employeename: req.body?.employeename,
    email: req.body.email,
    address: req.body?.address,
    phone: req.body?.phone,
    website: req.body?.website,
  };

  //Add new employee
  data.setEmployees([...data.employees, newEmployee]);

  return res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  //Get employee to update
  const employee = data.employees.find(employee => employee.id === parseInt(req.params.id));
  if (!employee) {
    return res.status(400).json({'message': 'Employee not found'});
  }
  //Update employee data
  if (req.body.name) employee.name = req.body.name;
  if (req.body.email) employee.email = req.body.email;
  if (req.body.employeename) employee.employeename = req.body.employeename;
  if (req.body.phone) employee.phone = req.body.phone;

  //Update list of employees
  const filteredEmployees = data.employees.filter(
      employee => employee.id !== parseInt(req.params.id));
  data.setEmployees([filteredEmployees, employee]);
  return res.status(200).json(data.employees);
};

const deleteEmployee = (req, res) => {
  //Get employee to delete
  const employee = data.employees.find(employee => employee.id === parseInt(req.params.id));
  if (!employee) {
    return res.status(400).json({'message': 'Employee not found'});
  }

  //Delete employee
  data.setEmployees(data.employees.filter(employee => employee.id !== employee.id));
  return res.status(204).json(data.employees);
};

const getEmployeeById = (req, res) => {
  const employee = data.employees.find(employee => employee.id === parseInt(req.params.id));
  if (!employee) {
    return res.status(400).json({'message': 'Employee not found'});
  }
  return res.status(200).json(employee);
};

module.exports = {getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee};