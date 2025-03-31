const express = require('express');
const router = express.Router();
const verifyRole = require('../middlewares/role.middleware');
const roles = require('../config/roles');
const {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employees.controller');

router.route('/').
    get(getEmployees).
    post(verifyRole(roles.Editor, roles.Admin), createEmployee);
router.route('/:id').
    get(verifyRole(roles.User, roles.Admin), getEmployee).
    put(verifyRole(roles.Editor, roles.Admin), updateEmployee).
    delete(verifyRole(roles.Admin), deleteEmployee);

module.exports = router;
