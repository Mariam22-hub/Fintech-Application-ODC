const Operation = require("../models/operationModel");
const User = require("../models/userModel");
const Card = require("../models/creditModel");

const getActivities = async (req, res) => {
  try {
    const {transactionName, username} = req.body;
    const operations = await Operation.find({transactionName: transactionName, username: username});
    res.status(200).json(operations);
  } catch (error) {
    res.status(400).json({ message: "User doesn't have any activity yet", status: false });
  }
};

const getActivity = async (req, res) => {
  try {
    const operation = await Operation.findOne(req.body);
    res.status(200).json(operation);
  } catch {
    res.status(404).json({ message: "Operation not found" });
  }
};


const pay = async(req,res)=>{
  
  const user = await User.findById(req.params.id).populate("creditCard");
  // console.log(user);

  const {paymentType, balance} = req.body;
  console.log(paymentType);
  console.log(balance);

  if (paymentType === "wallet"){
      user.balance -= balance;
      console.log(user.balance);
      await User.updateOne({_id: req.params.id }, { $set: { balance: user.balance }}); 
  }
  else if (paymentType === "credit"){
      
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
    
    try {
      const operationData = {
        username: user.userName,
        paymentOption: paymentOption,
        amount: amount,
        transactionName: "Service/Product Purchase",
        Details: "User made a payment"
      };
      await createActivityRecord({ body: operationData }, res);
    } catch (err) {
      res.status(403).json({ message: err, status: false });
    }
}

const createActivityRecord = async (req, res) => {
  const {username} = req.body;
  
  try {
    // const user = await User.findOne({userName: username}).populate("creditCard");
    const user = await User.findOne({userName: username});
    
    if (!user){
      return res.status(404).json({message: "User doesn't exist", status: false});
    }
    
    const operation = new Operation(req.body);

    operation.userId = user;

    operation.save();

    res.status(200).json({operation: operation, status: true});
  } catch (err) {
    res.status(403).json({ message: err, status: false });
  }
};

const updateActivity = async (req, res) => {
  try {
    await Operation.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Activity updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const deleteActivity = async (req, res) => {
  try {
    await Operation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Activity is deleted" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivityRecord,
  updateActivity,
  deleteActivity,
  pay,
};