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
  const student = await Student.find(condition)
    .select({
      educationDetails: 0,
      familyDetails: 0,
      __v: 0,
    })
    .populate("userId", {
      password: 0,
      userType: 0,
      __v: 0,
      createdTime: 0,
      sponsorId: 0,
    });
  return student;
};

//To get full details of student by certain condition
const getStudentByConditionFullData = async (condition) => {
  const student = await Student.find(condition)
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
  getStudentByConditionFullData,
  setStudent,
  updateStudent,
};
