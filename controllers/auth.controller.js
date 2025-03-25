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
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(data.users));
    console.log(data.users);
    return res.status(201).json({'Message': 'Successfully registered'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({'Message': error.message});
  }
};

const login = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).
        json({'Message': 'Username and Password are both required'});
  }

  const user = data.users.find(user => user.username === req.body.username);
  if (user) {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      //TODO Create JWT
      return res.status(200).json({'Message': 'Successfully logged in'});
    } else {
      return res.status(401).json({'Message': 'Invalid username or password'});
    }
  } else {
    return res.status(401).json({'Message': 'Invalid username or password'});
  }

};

module.exports = {register, login};