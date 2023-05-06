// password mush contain special characters and atleast one uppercase 
//try to check if the password already exists part

require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Card = require("../models/creditModel");
const nodemailer = require("nodemailer")
const {v4:uuidv4} = require("uuid");
const bcrypt = require("bcrypt");


const formData = require('form-data');
const mailgun = require('mailgun-js');
const { getMaxListeners } = require("../models/creditModel");

const DOMAIN = 'sandbox708c1eda3a7245fc87a9fc5ea1db7fef.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });


const createCard = async (req, res) => {
  try {
    const user = await User.findById(req.body); // assuming authenticateToken middleware has been used to set req.user

    const newCard = new Card();
    console.log(newCard)
    
    // save card id to user schema
    user.creditCard = newCard._id;
    newCard.user = user._id;
    user.cardNumber = newCard.creditNumber;

    await user.save();
    await newCard.save();

    res.status(201).json({ 
      message: 'Card created successfully',
      cardNumber: newCard.creditNumber 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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

// const updateUser = async (req, res) => {
//   try {
//     const UpdatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     res.json(UpdatedUser);
//   } catch (error) {
//     console.log(error);
//   }
// };

const updateUser = async (req, res) => {
  try {
    await User.updateOne({ _id: req.params.id }, { $set: { balance: req.body.propertyValue }});
    
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


const signup = async (req, res) => {

  const email = req.body.email;
  const username = req.body.userName;
  // consol.log(email)

  // if (await User.findOne({email})){
  //      return res.status(400).json({msg: "User with this email already exists",  status: false});
  // }
  
  // if  (await User.findOne({username})){
  //      return res.status(400).json({msg: "User with this username already exists" , status: false});
  // }

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

// const login = async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   console.log(user);
  
//   if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
//     console.log(req.body.password)
//     console.log(user.password)
//     res.status(404).json({ message: "Invalid Email or Password" });
//   } 
//   else {
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
//       expiresIn: process.env.JWT_EXPIRE_TIME,
//     });
    
//     res.status(200).json({ data: user, token });
//   }
// };


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
  console.log(req.user.userId);
  
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }


}


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  signup,
  login,
  transfer,
  createCard,
  activation,
  signup2
};
