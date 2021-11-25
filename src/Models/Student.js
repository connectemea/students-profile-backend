const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
  //sponsor ID
  sponsorId: {
    type: mongoose.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  //personal details
  personalDetails: {
    profileImage: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    admissionNO: {
      type: String,
      required: true,
    },
    yearOfJoin: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: Number,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    bloodGroup: {
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
    caste: {
      type: String,
      required: true,
    },
    categoryOfAdmission: {
      type: String,
      required: true,
    },
    identificationMarkOne: {
      type: String,
      required: true,
    },
    identificationMarkTwo: {
      type: String,
      required: true,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permenentAddress: {
      type: String,
      required: true,
    },
    residence: {
      type: String,
      required: true,
    },
    distanceFromCollege: {
      type: String,
      required: true,
    },
  },

  //education details
  educationDetails: {
    //10th standard
    tenthStd: {
      schoolName: {
        type: String,
        required: true,
      },
      syllabus: {
        type: String,
        required: true,
      },
      english: {
        type: Number,
        required: true,
      },
      maths: {
        type: Number,
        required: true,
      },
      science: {
        type: Number,
        required: true,
      },
      socialScience: {
        type: Number,
        required: true,
      },
    },

    //12th standard
    twelthStd: {
      schoolName: {
        type: String,
        required: true,
      },
      syllabus: {
        type: String,
        required: true,
      },
      course: {
        type: String,
        required: true,
      },
      sub: {
        type: Array,
        required: true,
      },
      subMark: {
        type: Array,
        required: true,
      },
      subMark: {
        type: Array,
        required: true,
      },
    },

    //array of degree
    degree: [
      {
        college: String,
        university: String,
        course: String,
        core: String,
        complementry: String,
        commonOne: String,
        commonTwo: String,
        open: String,
      },
    ],

    //other qualifications
    otherQualifications: [
      {
        institutionName: String,
        courseType: String,
        Grade: String,
        university: String,
      },
    ],

    //additional courses
    additionalCourse: [
      {
        courseName: String,
        institutionName: String,
        university: String,
        cgp: Number,
      },
    ],
  },
  //family details
  familyDetails: {
    father: {
      name: String,
      occupation: String,
      officialAddress: String,
      educationQualification: String,
      annualIncome: Number,
    },
    mother: {
      name: String,
      occupation: String,
      officialAddress: String,
      educationQualification: String,
      annualIncome: Number,
    },
    gardian: {
      name: {
        type: String,
        required: true,
      },
      occupation: {
        type: String,
        required: true,
      },
      officialAddress: {
        type: String,
        required: true,
      },
      educationQualification: {
        type: String,
        required: true,
      },
      annualIncome: {
        type: String,
        required: true,
      },
    },
  },
});

module.exports = mongoose.model("Students", StudentSchema);
