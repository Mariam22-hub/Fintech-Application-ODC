const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },

    transactionName: {
      type: String,
    },
    
    // transactionDetails: {
    //   type: String,
    //   default: function() {
    //     return `You transferred ${this.amount} to ${this.userId.userName}.`;
    //   },
    // },

    amount:{
      type: Number
    },
    
    purchaseDetails: {
      type: String,
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