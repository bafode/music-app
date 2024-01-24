const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
const faker=require('faker');
const User = require("../../api/models/userModel");

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.firstName(),
  email: faker.internet.email().toLowerCase(),
  isAdmin: false,
  password,
};

const userTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: faker.name.firstName(),
    email: faker.internet.email().toLowerCase(),
    isAdmin: false,
    password,
};

const admin = {
    _id: new mongoose.Types.ObjectId(),
    name: faker.name.firstName(),
    email: faker.internet.email().toLowerCase(),
    isAdmin: true,
    password,
};

const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

module.exports = {
    userOne,
    userTwo,
    admin,
    hashedPassword,
    insertUsers,
  };