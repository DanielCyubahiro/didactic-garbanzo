const express = require('express');
const router = express.Router();
const verifyRole = require('../middlewares/role.middleware');
const roles = require('../config/roles');
const {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employees.controller');

router.route('/').
    get(getEmployees).
    post(verifyRole(roles.Editor), createEmployee);
router.route('/:id').
    get(verifyRole(roles.User), getEmployeeById).
    put(verifyRole(roles.Editor), updateEmployee).
    delete(verifyRole(roles.Admin), deleteEmployee);

module.exports = router;
