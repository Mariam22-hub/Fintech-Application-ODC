const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema(
  {
    username: {
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
    
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
    },

    operationDate: {
      type: Date,
      default: Date.now()
    }
  }
  // { timestamps: true }
);

module.exports = mongoose.model("Operation", operationSchema);