const Operation = require("../models/operationModel");
const User = require("../models/userModel");
const Card = require("../models/creditModel");
const Child = require("../models/childModel");
const bcrypt = require("bcrypt")

//get all activity records for a user based on his/her username
const getActivities = async (req, res) => {
  try {
    const {transactionName, username} = req.body;
    
    //finding desired operations
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

async function paymentProcedure  (Model, paymentType, amount, CVV, res, req) {
  // Use the Model argument to interact with the database
  console.log(Model);

  if (paymentType === "wallet"){
    Model.balance -= amount;
    console.log(Model.balance)
    
    await Model.updateOne({_id: req.params.id }, { $set: { balance: Model.balance }});     
  }
  else if (paymentType === "credit"){
    
  try{

    console.log("inside credit")

    //getting relevant card
    const card = Model.creditCard;
    console.log(card)
  
    //authorizing the card
    const authorization = await bcrypt.compare(CVV, card.CVV);
    console.log(authorization);
  
    if (authorization) {
      card.balance -= amount;
      console.log(card.balance);
    } 
    else {
      throw new Error("Invalid CVV");
    }

    // updating the balance of the card based on the amount paid
      await Card.updateOne({_id : card._id }, { $set: { balance: card.balance }}); 
    }
    catch(e){
      return res.status(403).json({ 
          message: "User doesn't have a registered electronic credit card",
          status: false 
        });
    }
    
  }

  return res.status(200).json({message: "payment is processed sucessfully", status:true});
}

// an api activated whenever there's a purchase or payment made by the user
const pay = async(req,res)=>{

  const {paymentType, amount, CVV, role} = req.body;
  console.log(CVV, role)

  if (role == "child"){
    const child = await Child.findById(req.params.id).populate("creditCard");
    paymentProcedure(child, paymentType, amount, CVV, res, req);
  }
  else if (role == "parent"){
    const user = await User.findById(req.params.id).populate("creditCard");
    paymentProcedure(user, paymentType, amount, CVV, res, req);
  }

}

// this api is responsible for saving all activity records into the databse.
// it's called everytime a user makes on operation (i.e purchasing, paying a service, transferring money..etc)
const createActivityRecord = async (req, res) => {
  const {username, transactionName, recieverUsername} = req.body;
  
  try {
    // const user = await User.findOne({userName: username}).populate("creditCard");
    const user = await User.findOne({userName: username});
    let recieverUser;

    if (!user){
      return res.status(404).json({message: "User doesn't exist", status: false});
    }

    //creating a new operation/activity document
    const operation = new Operation(req.body);

    // storing the object of user in the operations schema
    operation.userId = user;

    if (transactionName === "transfer"){
      recieverUser = await User.findOne({userName: recieverUsername});

      if (!recieverUser){
        return res.status(404).json({message: "Receiever User doesn't exist", status: false});
      }

      operation.recieverUserId = recieverUser;
    }

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