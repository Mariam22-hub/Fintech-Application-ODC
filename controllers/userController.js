require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const secretKey = process.env.JWT_SECRET_KEY;

//middleware function to ensure the authorization of users when transferring funds
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader)

  const token = authHeader && authHeader.split(' ')[1];
  console.log(token)

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

const transfer = async (req,res) => {
  const { senderEmail, recepientEmail, amount } = req.body;
  console.log(senderEmail)
  console.log(recepientEmail)
  console.log(amount)

  try {
    const sender = await User.findOne({email: senderEmail});
    console.log(sender)

    const recipient = await User.findOne({email: recepientEmail});
    console.log(recipient)

    if (!sender || !recipient) {
      return res.status(400).send({ error: 'Invalid sender or recipient' });
    }

    if (sender.balance < amount) {
      return res.status(400).send({ error: 'Insufficient funds' });
    }

    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    res.send({ 
      message: `Successfully transferred ${amount} from ${sender.userName} to ${recipient.userName}` ,
      data: sender, recipient
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
  
  // 1- create user
  const user = await User.create(req.body);
  
  // 2- generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
  
  try{
    res.status(201).json({ 
      data: user, token
     });
  }
  catch(e){
    res.status(404).json({
      status: "failed",
      message: e
    });
  }


};

const login = async (req, res) => {
  // 1- check if email is exist
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return Error("Envalid Email or Password");
  }
  // 2- generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.json({ data: user, token });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  signup,
  login,
  authenticateToken,
  transfer
};
