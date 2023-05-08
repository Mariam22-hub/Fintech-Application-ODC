const Card = require("../models/creditModel");
const User = require("../models/userModel");

const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    res.status(200).json(card);
  } catch {
    res.status(404).json({ message: "Card not found" });
  }
};

const createCard = async (req, res) => {
    try {
      const user = await User.findById(req.params.id); // assuming authenticateToken middleware has been used to set req.user
      const {amount} = req.body; 
      
      const newCard = new Card(req.body);
      console.log(newCard)
      
      // save card id to user schema
      user.creditCard = newCard._id;
      newCard.user = user._id;
      user.cardNumber = newCard.creditNumber;
  
      user.balance -= amount;
      const newBalance = user.balance;
  
      await User.updateOne({_id: req.body._id }, { $set: { balance: newBalance }});
      await User.updateOne({_id: req.body._id }, { $set: { cardNumber: newCard.creditNumber }});
  
      // await user.save();
      // await newCard.save();
  
      res.status(201).json({ 
        message: 'Card created successfully',
        cardNumber: newCard.creditNumber 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCard = async (req, res) => {
  try {
    await Card.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Card updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Card is deleted" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
};