// requiring the express methods to create custom routes
const express = require("express");
const router = express.Router();

//auth utility
const authService = require("../Services/Auth");

const departmentService = require("../Services/Department");

// Utility to check the user permissions
const { checkUserHavePermission } = require("../helper/userPermission");

//get all departments
router.get("/", authService.autheticateTheUser, async (req, res) => {
  try {
    // check if this user have permission to do so
    if (checkUserHavePermission("teacher", req.body.user.type))
    
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });

    //getting all the departments
    const departments = await departmentService.getAllDepartments();

    //sending the response
    res.status(200).send({
      message: "fetched all department successfully",
      data: departments,
    });
  } catch (error) {
    res.status(500).send({
      message: "something went wrong",
      error: error,
    });
  }
});

//get department by id
router.get("/:id", authService.autheticateTheUser, async (req, res) => {
  try {
    // check if this user have permission to do so
    if (checkUserHavePermission("teacher", req.body.user.type))
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });
    //getting all the departments
    const department = await departmentService.getDepartmentById(req.params.id);

    //check if the department exist
    if (!department) res.status(404).send({ message: "department not found" });
    //sending the response
    res.status(200).send({
      message: "Fetched all department successfully",
      data: department,
    });
  } catch (err) {
    res.status(404).send({ message: "something went wrong", data: err });
  }
});

//create new department
router.post("/", authService.autheticateTheUser, async (req, res) => {
  try {
    // check if this user have permission to do so
    if (checkUserHavePermission("admin", req.body.user.type))
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });

    //getting deparment details from the request
    const departmentDetails = req.body.departmentDetails;

    //check if the department details are valid
    if (!departmentDetails) {
      return res
        .status(400)
        .send({ message: "please provide department details" });
    }

    //getting created department
    const department = await departmentService.createDepartment({
      createdBy: req.body.user.id,
      ...departmentDetails,
    });

    //sending the response
    res.status(200).send({
      message: "created new department successfully",
      data: department,
    });
  } catch (err) {
    res.status(404).send({ message: "something went wrong", data: err });
  }
});

//update department
router.patch("/:id", authService.autheticateTheUser, async (req, res) => {
  try {
    // check if this user have permission to do so
    if (checkUserHavePermission("admin", req.body.user.type))
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });

    //getting deparment details from the request
    const departmentDetails = req.body.departmentDetails;

    //check if the department details are valid
    if (!departmentDetails) {
      return res
        .status(400)
        .send({ message: "please provide department details" });
    }
    const currentDepartment = await departmentService.getDepartmentById(
      req.params.id
    );
    //check department exist
    if (!currentDepartment)
      return res.status(404).send({ message: "department not found" });

    //getting created department
    const department = await departmentService.updateDepartment(req.params.id, {
      ...departmentDetails,
      createdBy: req.body.user.id,
    });

    //sending the response
    res.status(200).send({
      message: "updated department successfully",
      data: department,
    });
  } catch (err) {
    res.status(404).send({ message: "something went wrong", data: err });
  }
});

//delete department
router.delete("/:id", authService.autheticateTheUser, async (req, res) => {
  try {
    // check if this user have permission to do so
    if (checkUserHavePermission("admin", req.body.user.type))
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });

    //getting created department
    const department = await departmentService.deleteDepartment(req.params.id);

    //check if the department exist
    if (!department)
      return res.status(404).send({ message: "department not found" });

    //sending the response
    res.status(200).send({
      message: "deleted department successfully",
      data: department,
    });
  } catch (err) {
    res.status(404).send({ message: "something went wrong", data: err });
  }

})

module.exports = router;
