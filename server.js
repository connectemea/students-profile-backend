//importing the libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// importing the environmental variables
require('dotenv/config')

// creating an instance of the express app
const app = express()

//importing custom routing file from routes folder
const TeacherRoutes = require('./src/Routes/Teachers');
const StudentRoutes = require('./src/Routes/Students');
const UserRoutes = require('./src/Routes/User');

//Using bodyparser through middleware to format the req body
app.use(bodyParser.json());

//ROUTES
//teachers routes
app.use('/teacher',TeacherRoutes);

//students routes
app.use('/student',StudentRoutes);

//users routes
app.use('/user',UserRoutes)


//Connecting to the Database (altas mongoDB)
mongoose.connect(process.env.DB_CONNECTION,()=>console.info("DB CONNECTED SUCCESSFULLY"))

// Running server in port 4000 
app.listen(4000)