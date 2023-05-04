// password mush contain special characters and atleast one uppercase 
//try to check if the password already exists part

require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const secretKey = process.env.JWT_SECRET_KEY;
const nodemailer = require("nodemailer")
const {v4:uuidv4} = require("uuid");

const creditCard = async (req,res) => {
  // Find the user by ID
  // const userId = 'USER_ID_GOES_HERE';
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }
}

const checkIfUserExists = async (username, email) => {
  const userByUsername = await User.findOne({ username: username });
  if (userByUsername) {
    return "username already exists"; // username already exists
  }
  const userByemail = await User.findOne({ email: email });
  
  if (userByemail) {
    return "email already exists"; // username already exists
  }

};

const handleErrors = (err, username) => {
  console.log(err.message, err.code);
  // let errors;
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    // errors = checkIfUserExists(username, email)
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

//////////////////////


const transfer = async (req,res) => {
  const { senderUsername, recipientUsername, amount } = req.body;
  console.log(senderUsername)
  console.log(recipientUsername)
  console.log(amount)

  try {
    const sender = await User.findOne({userName: senderUsername});
    // console.log(sender)

    const recipient = await User.findOne({userName: recipientUsername});
    // console.log(recipient)

    if (!sender || !recipient || sender.userName === recipient.userName) {
      // console.log(sender)
      // console.log(recipient)
      return res.status(400).send({ error: 'Invalid sender or recipient' });
    }

    if (sender.balance < amount ) {
      return res.status(400).send({ error: 'Insufficient funds' });
    }

    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    res.send({ 
      message: `Successfully transferred ${amount} from ${sender.userName} to ${recipient.userName}` ,
      SenderBalance: sender.balance,
      RecepientBalance: recipient.balance
    });
  } 
  catch (err) {
    console.error(err.message);
    res.status(500).send({ error: 'Internal Server Error' });
  }

}

/////////////////////////////

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    res.json(newUser);
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const UpdatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(UpdatedUser);
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const DeletedUser = await User.findByIdAndDelete(req.params.id);
    res.json(DeletedUser);
  } catch (error) {
    console.log(error);
  }
};


const signup = async (req, res) => {

  try{
    // 1- create user
     const user = await User.create(req.body);

    // 2- generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    res.status(201).json({ 
      data: user._id, token,
      status: true
     });
  }
  catch(e){
    const err = handleErrors(e, req.body.email, req.body.userName)
    res.status(400).json({
      status: false,
      message: err
    });
  }


};


const signup2 = async (req, res) => {

  try{
    // 1- create user
     const user = await User.create(req.body);

    // 2- generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    res.status(201).json({ 
      data: user._id, token,
      status: true
     });
  }
  catch(e){
    const err = handleErrors(e, req.body.email, req.body.userName)
    res.status(400).json({
      status: false,
      message: err
    });
  }


};

const login = async (req, res) => {

  const { email, password } = req.body;
  
  try{
    // go to the static function in the user model to check if the user exists
    const user = await User.login(email, password);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    res.status(200).json({ 
      user: user._id, token ,
      status: true
    });

  }
  catch(e){
    res.status(404).json({
      message: "invalid username or password",
      status: false
    })
  }
};

const forgetPassword = async(req, res)=>{
  const {email, newPassword, confirmPassword} = req.body;
  console.log("email");

  const user = User.findOne({email: email});


}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  signup,
  login,
  // authenticateToken,
  transfer,
  creditCard
};
