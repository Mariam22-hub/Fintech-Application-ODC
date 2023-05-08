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
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { balance } = req.body; 

      if (user.balance < balance ) {
        return res.status(400).send({ error: 'Insufficient funds in your wallet' });
      }
      
      const newCard = new Card(req.body);
      newCard.user = user._id;
      await newCard.save();
      
      const newBalance = ((user.balance) - balance);
  
      await User.updateOne({_id: req.params.id }, { $set: 
        { 
          balance: newBalance, 
          cardNumber: newCard.creditNumber,
          creditCard : newCard._id
        }
      });


      res.status(201).json({ 
        message: 'Card created successfully',
        cardNumber: newCard.creditNumber 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
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