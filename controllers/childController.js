const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Child = require("../models/childModel");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const getChilds = async (req, res) => {
  try {
    const childs = await Child.find();
    res.status(200).json(childs);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const getChild = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    res.status(200).json(child);
  } catch {
    res.status(404).json({ message: "User not found" });
  }
};

//creating a child using the id of a parent user in the request params (considering the parent will be the one
// creating the child's account )
const createChild = async (req, res) => {
  if (
    (await Child.findOne({ email: req.body.email })) ||
    (await Child.findOne({ email: req.body.userName }))
  ) {
    res.status(403).json({ message: "Email or Username is already exist" });
  } else {
    const user = await User.findById(req.params.id);
    const child = new Child(req.body);

    child.userId = user;
    child.save();

    res.status(200).json(child);
  }
};

const updateChild = async (req, res) => {
  try {
    await Child.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Child updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const deleteChild = async (req, res) => {
  try {
    await Child.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Child is deleted" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const signup = async (req, res) => {
  if (
    (await Child.findOne({ email: req.body.email })) ||
    (await Child.findOne({ email: req.body.userName }))
  ) {
    res.status(403).json({ message: "Email is already registed" });
  } else {
    const user = await User.findById(req.body.userId);
    const child = new Child(req.body);

    child.userId = user;
    child.save();

    const token = jwt.sign({ childId: child._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    res.status(200).json({ data: child, token });
  }
};

const login = async (req, res) => {
  const child = await Child.findOne({ email: req.body.email });
  
  if (!child || !(await bcrypt.compare(req.body.password, child.password))) {
    res.status(404).json({ message: "Wrong Email or Password" });
  } else {
    const token = jwt.sign({ childId: child._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    res.status(200).json({ data: child, token });
  }
};

const forgotPassword = async (req, res) => {
  const child = await Child.findOne({ email: req.body.email });
  if (!child) {
    return res.status(404).json({ message: "This email is not found" });
  }
  const resetToken = Child.createPasswordResetTokent();
  await child.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/childs/resetPassword/${resetToken}`;

  const message = `forgot your password? submit a PATCH request with your new password to: ${resetURL}. 
  \nif you didn't forgot your password, please ignore this email!`;

  try {
    await sendEmail({
      email: child.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      message: "token sent to email",
    });
  } catch (err) {
    child.passwordResetToken = undefined;
    child.passwordResetExpires = undefined;
    await child.save({ validateBeforeSave: false });
    return res.status(500).json(err);
  }
};

const resetPassword = async (req, res) => {
  // get Child based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const child = await Child.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if token has not expired, and there is Child, set new password
  if (!child) {
    return res.status(400).json({ message: "token is invalid or has expired" });
  }
  child.password = req.body.password;
  child.passwordResetToken = undefined;
  child.passwordResetExpires = undefined;
  await child.save();

  // log the Child in
  const token = jwt.sign(child._id);
  res.status(200).json(token);
};

module.exports = {
  getChilds,
  getChild,
  createChild,
  updateChild,
  deleteChild,
  signup,
  login,
  forgotPassword,
  resetPassword,
};