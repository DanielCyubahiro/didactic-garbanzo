const express = require('express');
const {getEmpolyees, createEmpolyee, getEmpolyeeById, updateEmpolyee, deleteEmpolyee} = require(
    '../controllers/employeesController');
const router = express.Router();

router.route('/').get(getEmpolyees).post(createEmpolyee);

router.route('/:id').get(getEmpolyeeById).put(updateEmpolyee).delete(deleteEmpolyee);

module.exports = router;
