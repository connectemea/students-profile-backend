// requiring the express methods to create custom routes
const express = require("express");
const router = express.Router();
const userService = require("../Services/User");
const authService = require("../Services/Auth");
const { checkUserHavePermission } = require("../helper/userPermission");

// configuaring the env keys
require("dotenv/config");

//index route to get all  users on DB
router.get("/", authService.autheticateTheUser, async (req, res) => {
  try {
    // check if this user have permission to do so
    if (checkUserHavePermission("teacher", req.body.user.type))
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });
    //setting the conditions
    const conditions = {
      sponsorId: req.body.user.id,
      userType: req.query.type ? req.query.type : "student",
    };
    //getting all user records
    const users = await userService.getUsersBycondition(conditions);
    //sending back the user records
    res.status(200).json({
      message: "All users records fethched successfully",
      data: users,
    });
  } catch (err) {
    //sending back the error
    res.status(404).json({ message: err.message });
  }
});

//To get User profile
router.get("/profile", authService.autheticateTheUser, async (req, res) => {
  try {
    //check if this user have permission to do so
    if (checkUserHavePermission("student", req.body.user.type))
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });

    //getting the user profile
    const user = await userService.getUserByIdProfile(req.body.user.id);
    //sending back the user profile
    res.status(200).json({
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (err) {
    //sending back the error
    res.status(404).json({ message: err.message });
  }
});

router.get("/:userId", authService.autheticateTheUser, async (req, res) => {
  try {
    // check if this user have permission to do so
    if (checkUserHavePermission("student", req.body.user.type))
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });

    //getting all user records
    const users = await userService.getUserById(userId);
    //sending back the user records
    res.status(200).json({
      message: "user fethched successfully",
      data: users,
    });
  } catch (err) {
    //sending back the error
    res.status(404).json({ message: err.message });
  }
});

//create new user
router.post("/", authService.autheticateTheUser, async (req, res) => {
  try {
    // check if this user have permission to do so
    if (checkUserHavePermission("teacher", req.body.user.type))
      return res
        .status(401)
        .send({ message: "You have no permission to do this action" });
    //Destructuring the variables from the request body
    const { username, email, userType, user } = req.body;
    const userData = {
      username,
      email,
      userType:
        user.type === "teacher" ? "student" : userType ? userType : "teacher",
      sponsorId: user.id,
      status: "created",
    };

    //checking for this user exists or not
    const isUserExists = await userService.checkUserExistsByLoginCredentials({
      username,
      email,
    });
    if (isUserExists) {
      return res
        .status(409)
        .json({ message: "username and email is already used" });
    }

    //waiting to create new user in database
    const createdUser = await userService.setUser(userData);

    //sending the created obj back as response
    return res
      .status(201)
      .json({ message: "New user created successfully", data: createdUser });
  } catch (err) {
    //sending back the error
    res.status(404).json({ message: err.message });
  }
});

//forget password
router.post("/forgot", async (req, res) => {
  const { username, email } = req.body;
  //checking username
  if (!username || !email)
    res.status(404).send({
      message: "forgot password credentials are not given",
    });

  //condition to fetch the user
  const conditions = {
    username,
    email,
  };
  //getting all user records
  const userData = await userService.getUsersBycondition(conditions);

  if (!userData || userData.length !== 1 || userData[0].status == "created")
    return res.status(404).send({
      message: "invalid username or password",
    });

  //data to embed as an paylod in token
  const userCoreData = {
    id: userData[0]._id,
    type: userData[0].userType,
  };

  //generating user jwt token
  const userToken = await authService.createNewToken(userCoreData);

  // sending back the generated token
  res.status(201).send({
    message: "user credential are successfully done",
    data: {
      userToken,
    },
  });
});

//reset password
router.patch("/reset", authService.autheticateTheUser, async (req, res) => {
  const { password } = req.body;
  //password is not provided
  if (!password)
    res.status(404).send({
      message: "new password is not provided",
    });

  //encrypting the password using cryptoJs
  const encryptedPassword = authService.encryptPassword(password);

  //updating the password
  await userService.updateUser(req.body.user.id, {
    password: encryptedPassword,
  });

  //sending back the response
  res.status(200).send({ message: "password successfully updated" });
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
  //check if req have the data or not
  if (!email || !username || !password)
    res.status(404).send({ message: "Register credentials are not given" });

  //checking the user status
  const userStatus = await userService.getUserStatusByLoginCredentials(
    userData
  );

  //check wheather user exitst or not
  if (!userStatus) {
    return res.status(451).send({ message: "user not exist" });
  }

  //check wheather user is registered or not
  if (userStatus.status !== "created") {
    return res.status(409).json({ message: "user is already registred" });
  }

  //check password provide or not
  if (password) {
    //encrypting the password using cryptoJs
    const encryptedPassword = authService.encryptPassword(password);

    //updating the password
    await userService.updateUser(userStatus._id, {
      password: encryptedPassword,
      status: "registred",
    });

    return res.status(200).json({ message: "password updated successfully" });
  }
  return res.status(406).send({ message: "password is not provided" });
});

// login new user
router.post("/login", async (req, res) => {
  //destructuring the body
  const { email, password } = req.body;

  //checking the email and password exists
  if (!email || !password) {
    return res
      .status(401)
      .send({ message: "Login creadentials are not given" });
  }

  try {
    //login credentials
    const loginCredentials = {
      email,
    };

    //check the user and also is the user legit or not
    const userData = await userService.getUserByLoginCredential(
      loginCredentials
    );
    //check the user exist or not
    if (!userData) {
      return res.status(401).send({ message: "invalid email or password" });
    }

    //check the user is registered or not
    if (userData.status === "created") {
      return res.status(401).send({ message: "user is not registered" });
    }

    //decrypt the password the password
    const decryptedPassword = authService.decryptPassword(userData.password);
    if (password !== decryptedPassword) {
      return res.status(401).send({ message: "invalid email or password" });
    }

    //data to embed as an paylod in token
    const userCoreData = {
      id: userData._id,
      type: userData.userType,
    };

    //generating user jwt token
    const token = await authService.createNewToken(userCoreData);

    res.status(200).send({
      message: "Successfully logged in",
      data: {
        token,
        username: userData.username,
        type: userData.userType,
        status: userData.status,
      },
    });
  } catch (err) {
    return res.status(401).send({ message: err.message });
  }
});
//exporting the custom route
module.exports = router;
