const data = {
  users: require('../models/users.json'),
  setUsers: function(data) {this.users = data;},
};

const getUsers = (req, res) => {
  return res.status(200).json(data.users);
};

const createUser = (req, res) => {
  //Validate data
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({'message': 'Name and Email are required'});
  }

  //Create user
  const newUser = {
    id: data.users[data.users.length - 1].id + 1 || 1,
    name: req.body.name,
    username: req.body?.username,
    email: req.body.email,
    address: req.body?.address,
    phone: req.body?.phone,
    website: req.body?.website,
  };

  //Add new user
  data.setUsers([...data.users, newUser]);

  return res.status(201).json(data.users);
};

const updateUser = (req, res) => {
  //Get user to update
  const user = data.users.find(user => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(400).json({'message': 'User not found'});
  }
  //Update user data
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.username) user.username = req.body.username;
  if (req.body.phone) user.phone = req.body.phone;

  //Update list of users
  const filteredUsers = data.users.filter(
      user => user.id !== parseInt(req.params.id));
  data.setUsers([filteredUsers, user]);
  return res.status(200).json(data.users);
};

const deleteUser = (req, res) => {
  //Get user to delete
  const user = data.users.find(user => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(400).json({'message': 'User not found'});
  }

  //Delete user
  data.setUsers(data.users.filter(user => user.id !== user.id));
  return res.status(204).json(data.users);
};

const getUserById = (req, res) => {
  const user = data.users.find(user => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(400).json({'message': 'User not found'});
  }
  return res.status(200).json(user);
};

module.exports = {getUsers, getUserById, createUser, updateUser, deleteUser};