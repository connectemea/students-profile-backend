// importing the user model
const User = require("../Models/User");

// GET OPERATIONS
//To get all user records
const getUsers = async () => {
  const users = await User.find();
  return users;
};

//To get an single user
const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

//To get user status by login credential
const getUserStatusByLoginCredentials = async (userdata) => {
  const userData = await User.findOne(userdata, "status");
  return userData;
};

// SET OPERATIONS
//To create new user
const setUser = async (userData) => {
  const user = new User({ ...userData, status: "created" });
  const createdUserObj = await user.save();
  return createdUserObj;
};

// UPDATE OPERATIONS
//To update an user
const updateUser = async (id, updateData) => {
  const updatedUser = await User.updateOne({ _id: id }, updateData);
  return updatedUser;
};

//SEARCH OPERATIONS
//To check user exists with given id
const checkUserExistsById = async (id) => {
  const isUserExists = await User.exists({ _id: id });
  return isUserExists;
};

//To check user exists with given username and password
const checkUserExistsByLoginCredentials = async (userData) => {
  const isUserExists = await User.exists(userData);
  return isUserExists;
};

//exporting all of the functions
module.exports = {
  getUsers,
  setUser,
  getUserById,
  checkUserExistsById,
  checkUserExistsByLoginCredentials,
  getUserStatusByLoginCredentials,
  updateUser
};
