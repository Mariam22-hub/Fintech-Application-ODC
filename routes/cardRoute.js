const router = require("express").Router();

const {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
} = require("../controllers/creditController");

router.route("/").get(getCards)
router.route("/:id").get(getCard).put(updateCard).delete(deleteCard).post(createCard);

module.exports = router;