//importing the libraries
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// importing the environmental variables
require("dotenv/config");

// creating an instance of the express app
const app = express();

//importing custom routing file from routes folder
const TeacherRoutes = require("./src/Routes/Teacher");
const StudentRoutes = require("./src/Routes/Student");
const UserRoutes = require("./src/Routes/User");
const DepartmentRoutes = require("./src/Routes/Department");
const Upload = require("./src/Routes/Upload");

//Using bodyparser through middleware to format the req body
app.use(bodyParser.json());

//ROUTES
//teachers routes
app.use("/teacher", TeacherRoutes);

//students routes
app.use("/student", StudentRoutes);

//department routes
app.use("/department", DepartmentRoutes);

//users routes
app.use("/user", UserRoutes);

//upload routes
app.use("/upload", Upload);

//public folder
app.use(express.static("./public"));

//Connecting to the Database (altas mongoDB)
mongoose.connect(process.env.DB_CONNECTION, () =>
  console.info("DB CONNECTED SUCCESSFULLY")
);

// Running server
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
