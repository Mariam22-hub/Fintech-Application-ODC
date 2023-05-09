const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },

    recieverUsername: {
      type: String,
    },

    to: {
      type: String,
    },

    from: {
      type: String,
    },

    transactionName: {
      type: String,
    },
    
    Details: {
      type: String
    },
    
    amount:{
      type: Number
    },
    
    paymentType: {
      type: String
    },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    recieverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
    },

    operationDate: {
      type: Date,
      default: Date.now()
    },
    role: {
      type: String
    }
  }
  // { timestamps: true }
);

module.exports = mongoose.model("Operation", operationSchema);