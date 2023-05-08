const Operation = require("../models/operationModel");

const getOperations = async (req, res) => {
  try {
    const operations = await Operation.find();
    res.status(200).json(operations);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const getOperation = async (req, res) => {
  try {
    const operation = await Operation.findById(req.params.id);
    res.status(200).json(operation);
  } catch {
    res.status(404).json({ message: "Operation not found" });
  }
};

const createOperation = async (req, res) => {
  try {
    const operation = await Operation.create(req.body);
    res.status(200).json(operation);
  } catch (err) {
    res.status(403).json({ message: err });
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