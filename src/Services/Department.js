//department model
const Department = require("../Models/Department");

//To get all departments
const getAllDepartments = async () => {
  const departments = await Department.find();
  return departments;
};

//To get a department by id
const getDepartmentById = async (id) => {
  const department = await Department.findById(id);
  return department;
};

//To create a new department
const createDepartment = async (department) => {
  const newDepartment = new Department(department);
  const savedDepartment = await newDepartment.save();
  return savedDepartment;
};

//To update a department
const updateDepartment = async (id, department) => {
  const updatedDepartment = await Department.findByIdAndUpdate(id, department, {
    new: true,
  });
  return updatedDepartment;
};

//export the functions
module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
};
