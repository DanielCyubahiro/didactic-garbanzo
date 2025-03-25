const express = require('express');
const router = express.Router();
const {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employees.controller');

router.route('/').get(getEmployees).post(createEmployee);
router.route('/:id').
    get(getEmployeeById).
    put(updateEmployee).
    delete(deleteEmployee);

module.exports = router;
