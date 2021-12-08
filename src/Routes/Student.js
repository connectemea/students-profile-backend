// requiring the express methods to create custom routes
const express = require("express");
const router = express.Router();

//auth utility
const authService = require("../Services/Auth");

const studentService = require("../Services/Student");

const userService = require("../Services/User");
// Utility to check the user permissions
const { checkUserHavePermission } = require("../helper/userPermission");

//index route to get all student records on DB
router.get("/", authService.autheticateTheUser, async (req, res) => {
  try {
    // check if this user have permission to do so
    if (checkUserHavePermission("teacher", req.body.user.type))
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });

    //setting the codition to fetch students
    let condition = {
      sponsorId: req.body.user.id,
    };
    //check dep query is passed or not
    if (req.query.department) {
      condition = {
        ...condition,
        "personalDetails.department": req.query.department
          ? req.query.department
          : undefined,
      };
    }
    //check joinyear is passed or not
    if (req.query.joinYear) {
      condition = {
        ...condition,
        "personalDetails.yearOfJoin": req.query.joinYear
          ? req.query.joinYear
          : undefined,
      };
    }
    //getting all student records
    const students = await studentService.getStudentByCondition(condition);
    //sending back the student records
    res.status(200).json({
      message: "All students records fethched successfully",
      data: students,
    });
  } catch (err) {
    //sending back the error
    res.status(403).json({ message: err.message });
  }
});
router.get("/me", authService.autheticateTheUser, async (req, res) => {
  try {
    const student = await studentService.getStudentByCondition({
      userId: req.body.user.id,
    });

    //check if the user data exisit or not
    if (!student) res.status(404).send({ message: "student not exist" });

    res
      .status(200)
      .send({
        message: "student details fetched successfully",
        data: { student },
      });

  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
});

//To get specific student
router.get("/:studentId", authService.autheticateTheUser, async (req, res) => {
  try {
    // check this is student autheraized or not
    if (
      checkUserHavePermission("teacher", req.body.user.type) &&
      req.body.user.id !== req.params.studentId
    )
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });

    //getting the student from the db
    const student = await studentService.getStudentById(req.params.studentId);

    //check wheather student exisist or not
    if (student.length)
      res.status(401).send({
        message: "student not exist",
      });

    //getting the user from database
    res
      .status(200)
      .send({ message: "student fetched successfully", data: student });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
});

//creating new student
router.post("/", authService.autheticateTheUser, async (req, res) => {
  try {
    if (req.body.user.type !== "student")
      res.status(404).send({ message: "Invalid user type" });
    const { personalDetails, educationDetails, familyDetails } = req.body;
    // checks student data is provided or not
    if (!personalDetails || !educationDetails || !familyDetails) {
      return res
        .status(401)
        .send({ message: "Some required details are not provided" });
    }
    //check this user registred already
    const student = await studentService.getStudentByCondition({
      userId: req.body.user.id,
    });
    //check student filled details or not
    if (student.length)
      return res.status(409).send({
        message: "Details Already filled",
      });
    const userProfile = await userService.getUserById(req.body.user.id);
    if (!userProfile) {
      return res.status(401).send({
        message: "user not exist",
      });
    }

    const studentDetails = {
      userId: req.body.user.id,
      sponsorId: userProfile.sponsorId,
      personalDetails,
      educationDetails,
      familyDetails,
    };

    const createdStudent = await studentService.setStudent(studentDetails);

    const updatedUser = await userService.updateUser(req.body.user.id, {
      status: "filled",
    });
    res.status(201).send({
      message: "student created successfully",
      data: { student: createdStudent, user: updatedUser },
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
});

//updating the Student
router.patch(
  "/:studentId",
  authService.autheticateTheUser,
  async (req, res) => {
    //get the student from the db
    const studentProfile = await studentService.getStudentById(
      req.params.studentId
    );

    //check student exist or not
    if (!studentProfile)
      return res.status(401).send({ message: "student not exist" });

    // check this is student autheraized or not
    if (
      req.body.user.type !== "student" ||
      studentProfile.userId.toString() !== req.body.user.id
    )
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });

    //getting data from the request body
    const { personalDetails, educationDetails, familyDetails } = req.body;
    const updatedData = {
      personalDetails,
      educationDetails,
      familyDetails,
    };
    //updating the student
    const updatedStudent = await studentService.updateStudent(
      req.body.user.id,
      updatedData
    );

    res.status(201).send({
      message: "student updated successfully",
      data: updatedStudent,
    });
  }
);

//exporting the custom route
module.exports = router;
