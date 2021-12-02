// requiring the express methods to create custom routes
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

//Auth service
const authService = require("../Services/Auth");
const userService = require("../Services/User");

// Utility to check the user permissions
const { checkUserHavePermission } = require("../helper/userPermission");

//requiring the upload service to upload the files
const uploadService = require("../Services/ImageUpload");

// route to upload a file
router.post("/", authService.autheticateTheUser, async (req, res) => {
  const userId = req.body.user.id;
  const user = await userService.getUserById(userId);
  if (user.profileImage)
    return res
      .status(200)
      .json({ message: "You already have a profile image" });
  //upload the file
  uploadService(req, res, async (err) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).send({ message: "No file selected" });
      } else {
        //setting the profile image path
        await userService.updateUser(userId, {
          profileImage: req.file.filename,
        });
        res.status(200).send({
          message: "File uploaded successfully",
          data: {
            filepath: `/upload/${req.file.filename}`,
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

    //user can only access their own image
    const user = await userService.getUserById(req.body.user.id);

    //check if the student have
    if (
      checkUserHavePermission("teacher", user.userType) &&
      user.profileImage !== req.params.filename
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
router.patch("/", authService.autheticateTheUser, async (req, res) => {
  //user can only access their own image
  const user = await userService.getUserById(req.body.user.id);
  //check if the student have
  if (!user.profileImage)
    res
      .status(404)
      .send({ message: "You don't have permission to update the image" });
  const isFileExists = fs.existsSync(
    path.join(__dirname, `../../public/uploads/${user.profileImage}`)
  );
  if (!isFileExists) return res.status(400).send({ message: "No file exists" });

  //image to be deleted
  uploadService(req, res, async (err) => {
    if (err) {
      res.status(500).send({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).send({ message: "No file selected" });
      } else {
        //delete the file
        fs.unlink(
          path.join(__dirname, `../../public/uploads/${user.profileImage}`),
          async (err) => {
            if (err) {
              res.status(500).send({ message: err });
            } else {
              //setting the profile image path
              await userService.updateUser(user._id, {
                profileImage: req.file.filename,
              });
              res.status(200).send({
                message: "File updated successfully ",
                data: {
                  filepath: `/upload/${req.file.filename}`,
                },
              });
            }
          }
        );
      }
    }
  });
});

module.exports = router;
