const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  profileImage: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  sponsorId: {
    type: mongoose.ObjectId,
    required: true,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Users", UserSchema);
