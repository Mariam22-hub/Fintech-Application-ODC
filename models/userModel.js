const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { isEmail } = require("validator");
// const {card} = require("../helperFunctions/helper");
const Operation = require("../models/operationModel");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true,"please enter a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true,"please enter a last name"],
      trim: true,
    },
    userName: {
      type: String,
      required: [true,"please enter a username"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true,"please enter a password"],
      trim: true,
      minLength: 8
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    phone: {
      type: String,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    creditCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card'
    },
    cardNumber: {
      type: String,
      maxlength: 16
      // trim: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    history: { type: Array, default: [] },

    operations: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "Operation"
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  console.log(user)
  
  if (user) {
    const authorization = await bcrypt.compare(password, user.password);
    console.log(authorization)
    if (authorization) {
      console.log(user)
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

module.exports = mongoose.model("User", userSchema);
