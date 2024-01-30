const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../api/models/userModel');

const generateHashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(8);
  return bcrypt.hashSync(password, salt);
};

const password = 'password1';

const generateUser = (isAdmin = false) => {
  return {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test', 
    email: isAdmin ? 'admin@example.com' : 'user@example.com', 
    isAdmin,
    password: generateHashedPassword(password),
  };
};

const userOne = generateUser();
const userTwo = generateUser();
const admin = generateUser(true);

const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user })));
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
