const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2222,
    },
    Admin: Number,
    Editor: Number,
  },
  refreshToken: String,
});

module.exports = mongoose.model('User', userSchema);