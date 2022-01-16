const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
  //sponsor ID
  sponsorId: {
    type: mongoose.ObjectId,
    ref: "Users",
    required: true,
  },
  userId: {
    type: mongoose.ObjectId,
    ref: "Users",
    required: true,
  },
  //personal details
  personalDetails: {
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
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
      ref: "Departments",
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
    permanentAddress: {
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
    //extra curricular activities
    extraCurricular: [
      {
        activity: String,
        yearOfParticipation: String,
        Price: String,
        detailsOfExcellenceInPerformance: String,
      },
    ],
    //depandentcies
    dependantcies: {
      classRoomLecture: {
        count: Number,
        remark: String,
      },
      LectureNote: {
        count: Number,
        remark: String,
      },
      notesProvidedByTeacher: {
        count: Number,
        remark: String,
      },
      caseStudy: {
        count: Number,
        remark: String,
      },
      observation: {
        count: Number,
        remark: String,
      },
      survey: {
        count: Number,
        remark: String,
      },
      expriments: {
        count: Number,
        remark: String,
      },
      extraReading: {
        count: Number,
        remark: String,
      },
      internetOrLearningApp: {
        count: Number,
        remark: String,
      },
    },
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
    guardian: {
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
