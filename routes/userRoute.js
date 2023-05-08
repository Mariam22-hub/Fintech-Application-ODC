const router = require("express").Router();
const {authenticateToken} = require("../middlewares/userMiddlewares");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  signup,
  login,
  transfer,
  // createCard,
  activation,
  signup2,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.route("/").get(getUsers).post(createUser).put(authenticateToken, activation);;
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
// router.post("/card", createCard);

router.post("/signup", signup);

// route for website sign up
router.post("/signupUser", signup2);

router.post("/login", login);
router.post("/transfer", transfer);

// route to transfer money on the website
router.post("/transferMoney", authenticateToken, transfer);

// router.post("/credit", createCard);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);


module.exports = router;
