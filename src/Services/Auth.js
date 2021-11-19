// importing jwt
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");

//configuaring env keys
require("dotenv/config");

//middleware to autheticate the user
const autheticateTheUser = async (req, res, next) => {
  //checking that is token is given or not
  if (!req.headers.token) {
    return res
      .status(401)
      .send({ message: "Autheraization credentials are not given" });
  }

  try {
    //verify the jwt token and decoding data from that
    const userCredentials = await jwt.verify(
      req.headers.token,
      process.env.TOKEN_SECRET_KEY
    );
    //injecting user details to the request
    req.body.user = userCredentials;
    //sending forward to the route function
    return next();
  } catch (err) {
    return res
      .status(401)
      .send({ message: "Invalid auth token", err: err.message });
  }
};

//To create new token with new credentials
const createNewToken = async (userCredentials) => {
  //creating jwt token using given credentials
  const userToken = await jwt.sign(
    userCredentials,
    process.env.TOKEN_SECRET_KEY,
  );

  //sending back the created token
  return userToken;
};
const encryptPassword = (password)=>{
  const encryptedPassword = crypto.AES.encrypt(
    password,
    process.env.PASS_SECRET_KEY
  ).toString();
  return encryptedPassword;
}
const decryptPassword = (hash)=>{
  const password = crypto.AES.decrypt(
    hash,
    process.env.PASS_SECRET_KEY
  ).toString(crypto.enc.Utf8)
  return password;
}

module.exports = {
  autheticateTheUser,
  createNewToken,
  encryptPassword,
  decryptPassword
};
