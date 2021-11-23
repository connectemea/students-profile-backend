const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  sponsorId: {
    type: mongoose.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  joinYear: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  maritalStatus: {
    type: String,
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  cast: {
    type: String,
    required: true,
  },
  educationQualification: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Teachers", TeacherSchema);
