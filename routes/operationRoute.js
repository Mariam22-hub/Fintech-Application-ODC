const router = require("express").Router();

const {
  getOperations,
  getOperation,
  createOperation,
  updateOperation,
  deleteOperation,
} = require("../controllers/operationController");

router.route("/").get(getOperations).post(createOperation);
router.route("/:id").get(getOperation).put(updateOperation).delete(deleteOperation);

module.exports = router;