const data = {
  users: require('../models/users.json'),
  setUsers: function(data) {this.users = data;},
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).
        json({'Message': 'Username and Password are both required'});
  }

  //Check if user is already registered
  const user = data.users.find(user => user.username === req.body.username);
  if (user) {
    return res.status(409).json({'Message': 'Username already registered'});
  }

  //Create new user
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      username: req.body.username,
      password: hashedPassword,
    };
    data.setUsers([...data.users, newUser]);
    await fsPromises.writeFile(path.join(__dirname, '..', 'models', 'users.json'), JSON.stringify(data.users))
    console.log(data.users);
    return res.status(201).json({'Message': 'Successfully registered'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({'Message': error.message});
  }
};

module.exports = {register};