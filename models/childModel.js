const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
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
      },
      parentUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }

});

childSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});


module.exports = mongoose.model("Child", childSchema);