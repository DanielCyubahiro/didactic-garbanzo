const Employee = require('../models/employee.model');
const ApiResponse = require('../utils/response.util');
const ApiError = require('../utils/error.util');

/**
 * Get all employees
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find();
    if (!employees) return res.sendStatus(204); // No content if empty
    return res.status(200).json(new ApiResponse(
        200,
        employees,
        'Employees retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single employee by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return next(new ApiError(404, 'Employee not found'));
    return res.status(200).
        json(new ApiResponse(
            200,
            employee,
            'Employee retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createEmployee = async (req, res, next) => {
  try {
    const newEmployee = await Employee.create(req.body);
    return res.status(201).json(new ApiResponse(
        201,
        newEmployee,
        'Employee created'));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) return next(new ApiError(404, 'Employee not found'));

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run model validators on update
    });
    return res.status(200).json(new ApiResponse(
        200,
        employee,
        'Employee updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return next(new ApiError(404,'Employee not found'));

    return res.status(200).json(new ApiResponse(
        200,
        employee,
        'Employee deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};