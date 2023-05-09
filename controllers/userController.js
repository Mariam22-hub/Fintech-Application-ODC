// password mush contain special characters and atleast one uppercase 
//try to check if the password already exists part

require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Card = require("../models/creditModel");
const nodemailer = require("nodemailer")
const {v4:uuidv4} = require("uuid");
const sendEmail = require("../utils/sendEmail");

const mailgun = require('mailgun-js');
const { getMaxListeners } = require("../models/creditModel");

const DOMAIN = 'sandbox708c1eda3a7245fc87a9fc5ea1db7fef.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });


const transfer = async (req,res) => {
  const { senderUsername, recipientUsername, amount } = req.body;

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
    const newSenderAmount = sender.balance;

    recipient.balance += amount;
    const newrecipientAmount = recipient.balance;

    await User.updateOne({userName: recipientUsername }, { $set: { balance: newrecipientAmount }});
    await User.updateOne({userName: senderUsername }, { $set: { balance: newSenderAmount }});

    // await sender.save();
    // await recipient.save();

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
    await User.updateOne({ _id: req.params.id }, { $set: { balance: req.body.balance }});
    
    res.status(200).json({ message: 'User updated successfully', status: true });
  } catch (error) {
    console.log(error);
    res.status(200).json({status: false});
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

const sendVerification = ({_id, email}, res)=>{
  const url = "http://localhost:3000/";
  const uniqueString = uuidv4() + _id;

  const mailing = {
    from: "noreply@tabCash.com",
    to: email,
    subject: "Account Activation",
    text: "Please verify your account",
    html: `<h2>Please activate your account using the following link</h2>
            <p> This link expires in 6 hours </p>
            <p> Click <a href = ${url + "user/activation/" + _id + "/" + uniqueString}> here </a> to proceed</p>`
  }
}

// a sign up funciton without email verification used in the mobile application
const signup = async (req, res) => {


  try{
    // 1- create user
     const user = await User.create(req.body);
     console.log(user);

    // 2- generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    res.status(201).json({ 
      data: user._id, token,
      status: true
     });
  }
  catch(e){
    // const err = handleErrors(e, req.body.email, req.body.userName)
    res.status(400).json({
      status: false,
      message: e
    });
  }


};


const login = async (req, res) => {

  const { email, password } = req.body;
  
  try{
    // go to the static function in the user model to check if the user exists
    const user = await User.login(email, password);
    console.log(user)
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    console.log(token);
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


const signup2 = async (req, res) => {
  const email = req.body.email;
  const username = req.body.userName;

  if (await User.findOne({email})){
       return res.status(400).json({msg: "User with this email already exists"});
  }
  else if  (await User.findOne({username})){
       return res.status(400).json({msg: "User with this username already exists"});
  }


  try{
    // 1- create user
     const user = await User.create(req.body);
    
     // 2- generate token
    const token = jwt.sign({ userId: user._id , email: user.email},  process.env.JWT_SECRET_KEY, 
      {expiresIn: "24h"});
      

    const data = {
      from: "noreply@tabCash.com",
      to: user.email,
      subject: "Account Activation",
      text: "Please verify your account",
      html: `<h2>Please activate your account using the following link</h2>
              <p> ${process.env.CLIENT_URL}/activate/${token}</p>`
      
    };

    mg.messages().send(data, function(error, body){
      console.log(body);
      
      if (error){
        res.status(400).json({
          status: false,
          msg: error
        });
      }
    })

    res.status(201).json({ 
      data: user._id, token,
      status: true,
      msg: "An activation link has been sent to your email, kindly activate your account"
     });
  }
  catch(e){
    // const err = handleErrors(e, req.body.email, req.body.userName)
    res.status(400).json({
      status: false,
      error: e
    });
  }

};

//email activation function
const activation = async (req,res)=>{
  // console.log(req.user.userId);
  
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verified = true;
    await User.updateOne({_id: req.user.userId }, { $set: { verified: true }});
    // await user.save();

    return res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }


}


const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "This email is not found" });
  }
  const resetToken = user.createPasswordResetTokent();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;
  const message = `forgot your password? submit a PATCH request with your new password to: ${resetURL}. 
  \nif you didn't forgot your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      message: "token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json(err);
  }
};

const resetPassword = async (req, res) => {
  // get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if token has not expired, and there is user, set new password
  if (!user) {
    return res.status(400).json({ message: "token is invalid or has expired" });
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // log the user in
  const token = jwt.sign(user._id);
  res.status(200).json(token);
};


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  signup,
  login,
  transfer,
  activation,
  signup2,
  forgotPassword,
  resetPassword,
};
