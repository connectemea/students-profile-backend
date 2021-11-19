// importing the students model
const Student = require("../Models/Student");

// To get all students records
const getStudents = async () => {
  const students = await Student.find();
  return students;
};
// To get an single student
const getStudentById = async (id) => {
  const student = await Student.findById(id);
  return student;
};
//To get student by certain codition
const getStudentByCondition = async (condition) => {
  const student = await Student.find(condition);
  return student;
};

// To create new Student
const setStudent = async (userData) => {
  const student = new Student(userData);
  const createdStudentObj = await student.save();
  return createdStudentObj;
};

//To update the Student
const updateStudent = async (id, updatedData) => {
  const updatedStudent = await Student.updateOne({ _id: id }, updatedData);
  return updatedStudent;
};

//Exporting all of the methods
module.exports = {
  getStudents,
  getStudentById,
  getStudentByCondition,
  setStudent,
  updateStudent,
};
