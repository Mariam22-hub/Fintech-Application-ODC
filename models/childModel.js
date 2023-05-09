const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { isEmail } = require("validator");

const childSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },
    category: { type: Array, default: [] },
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
    },
    operations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Operation",
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    creditCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card'
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

childSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

childSchema.methods.createPasswordResetTokent = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("Child", childSchema);