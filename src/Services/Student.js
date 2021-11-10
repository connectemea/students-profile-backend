// importing the students model
const Student = require("../Models/Student");

// To get all students records
const getStudents = async () => {
  const students = await Student.find();
  return students;
};

// To create new Student
const setStudent = async (userData) => {
  const student = new Student(userData);
  const createdStudentObj = await student.save();
  return createdStudentObj;
};

// To get an single student
const getStudent = async (id) => {
  const student = await Student.findById(id);
  return student;
};

//To check student with given id exists or not
const checkStudentExists = async (id) => {
  const IsExisits = await Student.exists({ _id: id });
  return IsExisits;
};

//Exporting all of the methods
module.exports = {
  getStudents,
  setStudent,
  getStudent,
  checkStudentExists,
};
