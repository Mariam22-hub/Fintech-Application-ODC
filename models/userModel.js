const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { isEmail } = require("validator");
// const {card} = require("../helperFunctions/helper");

function generateCreditCardNumber() {
  // Generate 15 random digits
  let digits = '';
  for (let i = 0; i < 15; i++) {
    digits += Math.floor(Math.random() * 10);
  }

  // Calculate checksum using Luhn algorithm
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(digits[i]);
    if ((i + 1) % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  let checksum = (10 - (sum % 10)) % 10;

  // Return complete credit card number
  console.log(digits + checksum.toString());
  // let num = digits + checksum;

  return (digits + checksum.toString());
}


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
      minLength: 8,
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
    cardNumber: {
      type: String,
      // trim: true
    },
    history: { type: Array, default: [] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  this.cardNumber = generateCreditCardNumber();
  console.log(JSON.stringify(this.cardNumber))
  next();
});

module.exports = mongoose.model("User", userSchema);
