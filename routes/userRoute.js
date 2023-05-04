const router = require("express").Router();
// const {authenticateToken} = require("../middlewares/userMiddlewares");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  signup,
  login,
  // authenticateToken,
  transfer,
  creditCard,
} = require("../controllers/userController");

router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.post("/signup", signup);
router.post("/login", login);
router.post("/transfer", transfer);
router.post("/credit", creditCard);


module.exports = router;
