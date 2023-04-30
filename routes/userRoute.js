const router = require("express").Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  signup,
  login,
  authenticateToken,
  transfer,
} = require("../controllers/userController");

router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.post("/signup", signup);
router.post("/login", login);
router.post("/transfer", authenticateToken, transfer);


module.exports = router;
