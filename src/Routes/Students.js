// requiring the express methods to create custom routes
const express = require('express');
const router = express.Router();

//index route to get all teachers records on DB
router.get('/',(req,res)=>res.send("GET All Students records"));


//exporting the custom route
module.exports = router;