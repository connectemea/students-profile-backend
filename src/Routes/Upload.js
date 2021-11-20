// requiring the express methods to create custom routes
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

//Auth service
const authService = require("../Services/Auth");
const studentService = require("../Services/Student");

// Utility to check the user permissions
const { checkUserHavePermission } = require("../helper/userPermission");

//requiring the upload service to upload the files
const uploadService = require("../Services/ImageUpload");

// route to upload a file
router.post("/", (req, res) => {
  //upload the file
  uploadService(req, res, (err) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).send({ message: "No file selected" });
      } else {
        res.status(200).send({
          message: "File uploaded successfully",
          data: {
            filepath: `/uploads/${req.file.filename}`,
          },
        });
      }
    }
  });
});

//route to get uploaded image
router.get("/:filename", authService.autheticateTheUser, async (req, res) => {
  try {
    if (checkUserHavePermission("teacher", req.body.user.type))
      res
        .status(404)
        .send({ message: "You don't have permission to access this route" });

    //student can only access their own image
    const student = await studentService.getStudentByCondition({
      userId: req.body.user.id,
    });

    //check if the student have
    if (
      checkUserHavePermission("teacher", req.body.user.type) &&
      (student.length === 0 ||
        student[0].personalDetails.Profile !== req.params.filename)
    )
      res
        .status(404)
        .send({ message: "You don't have permission to access this route" });

    //get the file path
    const isFileExists = fs.existsSync(
      path.join(__dirname, `../../public/uploads/${req.params.filename}`)
    );
    //setting the file path
    const filePath = path.join(
      __dirname,
      `../../public/uploads/${req.params.filename}`
    );
    //check if file exists
    if (isFileExists && filePath) {
      //send the file
      res.sendFile(filePath);
    } else {
      //if file does not exist
      res.status(400).send({ message: "No file exists" });
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

//route to delete the uploaded file
router.delete("/:filename", (req, res) => {
  if (checkUserHavePermission("teacher", req.body.user.type))
    res
      .status(404)
      .send({ message: "You don't have permission to access this route" });

  //student can only access their own image
  const student = await studentService.getStudentByCondition({
    userId: req.body.user.id,
  });

  //check if the student have
  if (
    checkUserHavePermission("teacher", req.body.user.type) &&
    (student.length === 0 ||
      student.personalDetails.profileimage !== req.params.filename)
  )
    res
      .status(404)
      .send({ message: "You don't have permission to access this route" });
  //check if the file exists
  const isFileExists = fs.existsSync(
    path.join(__dirname, `../../public/uploads/${req.params.filename}`)
  );
  if (!isFileExists) {
    res.status(400).send({ message: "No file exists" });
  }
  //delete the file
  fs.unlink(
    path.join(__dirname, `../../public/uploads/${req.params.filename}`),
    (err) => {
      if (err) {
        res.status(500).send({ message: err });
      } else {
        res.status(200).send({ message: "File deleted successfully" });
      }
    }
  );
});

module.exports = router;
