const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const employeeSchema = new Schema({
      name: String,
      username: String,
      email: String,
      phone: String,
      website: String,
    },
);

module.exports = mongoose.model('employee', employeeSchema);