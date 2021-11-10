// requiring the express methods to create custom routes
const express = require("express");
const router = express.Router();
const userService = require("../Services/User");
const crypto = require("crypto-js");
// configuaring the env keys
require("dotenv/config");

//index route to get all  users on DB
router.get("/", async (req, res) => {
  try {
    //getting all user records
    const users = await userService.getUsers();
    //sending back the user records
    res.status(403).json({
      message: "all users records fethched successfully",
      data: users,
    });
  } catch (err) {
    //sending back the error
    res.status(403).json({ message: err.message });
  }
});

//create new user
router.post("/", async (req, res) => {
  try {
    //Destructuring the variables from the request body
    const { username, email } = req.body;
    const userData = {
      username,
      email,
    };
    //checking for this user exists or not
    const isUserExists = await userService.checkUserExistsByLoginCredentials(
      userData
    );
    if (isUserExists) {
      return res
        .status(226)
        .json({ message: "username or email is already used" });
    }
    //waiting to create new user in database
    const createdUser = await userService.setUser(userData);
    //sending the created obj back as response
    return res.status(201).json(createdUser);
  } catch (err) {
    //sending back the error
    res.status(403).json({ message: err.message });
  }
});

//registering new user
router.patch("/register", async (req, res) => {
  //destructuring req body
  const { username, email, password } = req.body;

  //login credentials
  const userData = {
    username,
    email,
  };

  //checking the user status
  const userStatus = await userService.getUserStatusByLoginCredentials(
    userData
  );

  //check wheather user exitst or not
  if (!userStatus) {
    return res.status(451).send({ message: "user not exists" });
  }

  //check wheather user is registered or not
  if (userStatus.status !== "created") {
    return res.status(226).json({ message: "user is already registred" });
  }

  //check password provide or not
  if (password) {
    //encrypting the password using cryptoJs
    const encryptedPassword = crypto.AES.encrypt(
      password,
      process.env.PASS_SECRET_KEY
    ).toString();

    //updating the password
    await userService.updateUser(userStatus._id, {
      password: encryptedPassword,
    });

    return res.status(205).json({ message: "password updated successfully" });
  }
  return res.status(406).send({ message: "password is not provided" });
});

//exporting the custom route
module.exports = router;
