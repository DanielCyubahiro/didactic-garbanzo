const express = require('express');
const router = express.Router();
const verifyRole = require('../middlewares/role.middleware');
const roles = require('../config/roles');
const {
  getEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee,
} = require('../controllers/employees.controller');
const {
  createEmployeeValidation, updateEmployeeValidation, employeeIdValidation,
} = require('../validations/employee.validation');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});

router.route('/').
    get(getEmployees).
    post(verifyRole(roles.Editor, roles.Admin),
        validator.body(createEmployeeValidation), createEmployee);
router.route('/:id').
    get(verifyRole(roles.User, roles.Admin),
        validator.params(employeeIdValidation), getEmployee).
    put(verifyRole(roles.Editor, roles.Admin),
        validator.params(employeeIdValidation),
        validator.body(updateEmployeeValidation), updateEmployee).
    delete(verifyRole(roles.Admin), validator.params(employeeIdValidation),
        deleteEmployee);

// Error handling middleware for validation errors
router.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    const errorMessages = err.error.details.map(detail => detail.message);
    return res.status(400).json({
      error: 'Validation Error',
      messages: errorMessages
    });
  }
  next(err);
});
module.exports = router;
