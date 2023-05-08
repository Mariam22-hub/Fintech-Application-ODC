const Operation = require("../models/operationModel");
const User = require("../models/userModel");
const Card = require("../models/creditModel");

const getOperations = async (req, res) => {
  try {
    const {transactionName, username} = req.body;
    const operations = await Operation.find({transactionName: transactionName, username: username});
    res.status(200).json(operations);
  } catch (error) {
    res.status(400).json({ message: "User doesn't have any activity yet", status: false });
  }
};

const getOperation = async (req, res) => {
  try {
    const operation = await Operation.findOne(req.body);
    res.status(200).json(operation);
  } catch {
    res.status(404).json({ message: "Operation not found" });
  }
};


const createOperation = async (req, res) => {
  const {username, amount} = req.body;
  // console.log(username, amount);
  
  try {

    const user = await User.findOne({userName: username}).populate("creditCard");
    const operation = await Operation.create(req.body);

    operation.userId = user;
    
    const paymentOption = operation.paymentType;
    // console.log(paymentOption);

    if (paymentOption === "wallet"){
      user.balance -= amount;
      // console.log(user.balance);
      await User.updateOne({userName: username }, { $set: { balance: user.balance }}); 
    }
    else if (paymentOption === "credit"){

      try{
        user.creditCard.balance -= amount;

        await Card.updateOne({_id : user.creditCard._id }, { $set: { balance: user.creditCard.balance }}); 

      }
      catch(e){
        res.status(403).json({ 
            message: "User doesn't have a registered electronic credit card", 
            status: false 
          });
      }
      
    }

    res.status(200).json({operation: operation, status: true});
  } catch (err) {
    res.status(403).json({ message: err, status: false });
  }
};

const updateOperation = async (req, res) => {
  try {
    await Operation.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Operation updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const deleteOperation = async (req, res) => {
  try {
    await Operation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Operation is deleted" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  getOperations,
  getOperation,
  createOperation,
  updateOperation,
  deleteOperation,
};