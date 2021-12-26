// requiring the express methods to create custom routes
const express = require("express");
const router = express.Router();

//auth utility
const authService = require("../Services/Auth");

const teacherService = require("../Services/Teacher");

const userService = require("../Services/User");

// Utility to check the user permissions
const { checkUserHavePermission } = require("../helper/userPermission");

//index route to get all teacher records on DB
router.get("/", authService.autheticateTheUser, async (req, res) => {
  try {
    // check if this user have permission to do so
    if (checkUserHavePermission("admin", req.body.user.type))
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });
    let condition = {};
    
    //check dep query is passed or not
    if (req.query.department) {
      let condition = {
        ...condition,
        "personalDetails.department": req.query.department
          ? req.query.department
          : undefined,
      };
    }
    //check joinyear is passed or not
    if (req.query.joinYear) {
      let condition = {
        ...condition,
        "personalDetails.yearOfJoin": req.query.joinYear
          ? req.query.joinYear
          : undefined,
      };
    }
    //getting all teacher records
    const teachers = await teacherService.getTeacherByCondition(condition);
    //sending back the teacher records
    res.status(200).json({
      message: "All teachers records fethched successfully",
      data: teachers,
    });
  } catch (err) {
    //sending back the error
    res.status(403).json({ message: err.message });
  }
});

//To get the requested teacher profile by userId
router.get("/me", authService.autheticateTheUser, async (req, res) => {
  try {
    const teacher = await teacherService.getTeacherByCondition({
      userId: req.body.user.id,
    });

    //check if the user data exisit or not
    if (!teacher.length || teacher.length !== 1)
      res.status(404).send({ message: "teacher not exist" });

    res.status(200).send({
      message: "teacher details fetched successfully",
      data: { teacher: teacher[0] },
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
});

//To get specific teacher
router.get("/:teacherId", authService.autheticateTheUser, async (req, res) => {
  try {
    // check this is teacher autheraized or not
    if (
      checkUserHavePermission("teacher", req.body.user.type) &&
      req.body.user.id !== req.params.teacherId
    )
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });

    //getting the teacher from the db
    const teacher = await teacherService.getTeacherById(req.params.teacherId);

    //check wheather teacher exisist or not
    if (!teacher)
      res.status(401).send({
        message: "teacher not exist",
      });

    //getting the user from database
    res
      .status(200)
      .send({ message: "teacher fetched successfully", data: teacher });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
});



//creating new teacher
router.post("/", authService.autheticateTheUser, async (req, res) => {
  try {
    //check user type
    if (req.body.user.type !== "teacher")
      res.status(404).send({ message: "Invalid user type" });
    const teacherData = req.body.teacherDetails;
    // checks teacher data is provided or not
    if (!teacherData) {
      return res
        .status(401)
        .send({ message: "Some required details are not provided" });
    }

    const userProfile = await userService.getUserById(req.body.user.id);
    if (!userProfile) {
      return res.status(401).send({
        message: "user not exist",
      });
    }

    const teacherDetails = {
      userId: req.body.user.id,
      sponsorId: userProfile.sponsorId,
      ...teacherData,
    };

    const createdTeacher = await teacherService.setTeacher(teacherDetails);

    const updatedUser = await userService.updateUser(req.body.user.id, {
      status: "filled",
    });
    res.status(201).send({
      message: "teacher created successfully",
      data: { teacher: createdTeacher, user: updatedUser },
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
});

//updating the Student
router.patch(
  "/:teacherId",
  authService.autheticateTheUser,
  async (req, res) => {
    try {
      const teacherProfile = await teacherService.getTeacherById(
        req.params.teacherId
      );
      if (!teacherProfile)
        return res.status(401).send({ message: "Teacher not exist" });
      // check this is teacher autheraized or not
      if (
        req.body.user.type !== "teacher" ||
        teacherProfile.userId.toString() !== req.body.user.id
      )
        return res
          .status(401)
          .send({ message: "You have no permission to do this action" });
      //getting data from the request body
      const updatedData = req.body.teacherDetails;
      //updating the teacher
      const updatedTeacher = await teacherService.updateTeacher(
        req.params.teacherId,
        updatedData
      );

      res.status(201).send({
        message: "teacher updated successfully",
        data: updatedTeacher,
      });
    } catch (err) {
      res.status(404).send({
        message: err.message,
      });
    }
  }
);

//exporting the custom route
module.exports = router;
