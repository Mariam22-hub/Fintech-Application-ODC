const router = require("express").Router();

const {
  getChilds,
  getChild,
  createChild,
  updateChild,
  deleteChild,
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/childController");

router.route("/").get(getChilds);
router.route("/:id").get(getChild).put(updateChild).delete(deleteChild).post(createChild);
router.post("/:id/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

module.exports = router;