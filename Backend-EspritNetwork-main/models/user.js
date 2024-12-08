const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      required: false,
    },
    secret: {
      type: String,
      required: false,
    },
    pic: {
      type: String,
      required: false,
    },
    password: {
      type: String,
    },
    confirmPassword: {
      type: String,
    },
    role: {
      type: String,
      enum: [ "ADMIN" , 'student', 'alumni', 'esprit_staff', 'teacher', 'company' ],
      default: "user",
      required: true,
    },
    token: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verifyToken: {
      type: String,
      required: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    previousLogin: {
      type: Date,
    }, 
    
    adresseC: {
        type: String,
    },
    nameC  : {
      type: String,
  },
  descriptionC:  {
    type: String,
},
cin:  {
  type: Number,
} , 
cin:  {
  type: Number,
},




  },
  {
    timestamps: true,
  }
);

// Login
userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Register
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
