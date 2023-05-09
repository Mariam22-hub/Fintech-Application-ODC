const Product = require("../models/productModel");
const Child = require("../models/childModel");

const getChildProducts = async (req, res) => {
  try {
    // Find the child by ID
    const child = await Child.findById(req.params.userId);
    const categories = child.category;
    
    // Find all products that match any of the categories in the child's array
    const products = await Product.find({ category: { $in: categories } });
    res.status(200).json(products);

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};


const getAllProducts = async (req, res) => {
  try {  

    const products = await Product.find();
    res.status(200).json(products);

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
}
  
  const createProduct = async (req, res) => {
    try {
      const product = new Product(req.body);
      const newProduct = await product.save();
      res.json(newProduct);
    } catch (error) {
      console.log(error);
    }
  };
  
  const updateProduct = async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      
      res.status(200).json({ message: 'Product updated successfully', status: true });
    } catch (error) {
      console.log(error);
      res.status(200).json({status: false});
    }
  };
  
  const deleteProduct = async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      res.json(deletedProduct);
    } catch (error) {
      console.log(error);
    }
  };

  module.exports = {
    deleteProduct,
    updateProduct,
    createProduct,
    getChildProducts,
    getAllProducts,
  };