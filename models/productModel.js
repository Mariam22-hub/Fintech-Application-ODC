const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    stock: {
        type: Number
    },
    category:{
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    price: {
        type: Number,
        require: true,
    }

})

module.exports = mongoose.model("Product", productSchema);