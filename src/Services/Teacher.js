// importing the Teacher model
const Teacher = require("../Models/Teacher");

// To get all Teacher records
const getTeacher = async () => {
  const teacher = await Teacher.find();
  return teacher;
};
// To get an single student
const getTeacherById = async (id) => {
  const teacher = await Teacher.findById(id);
  return teacher;
};
//To get teacher by certain codition
const getTeacherByCondition = async (condition) => {
  const teacher = await Teacher.find(condition)
    .select({
      __v: 0,
    })
    .populate("userId", {
      password: 0,
      userType: 0,
      __v: 0,
      createdTime: 0,
      sponsorId: 0,
    });
  return teacher;
};

// To create new Student
const setTeacher = async (userData) => {
  const teacher = new Teacher(userData);
  const createdTeacherObj = await teacher.save();
  return createdTeacherObj;
};

//To update the Teacher
const updateTeacher = async (id, updatedData) => {
  const updatedTeacher = await Teacher.updateOne({ _id: id }, updatedData);
  return updatedTeacher;
};

//Exporting all of the methods
module.exports = {
  getTeacher,
  getTeacherById,
  getTeacherByCondition,
  setTeacher,
  updateTeacher,
};
