const router = require("express").Router();

const {
  getActivities,
  getActivity,
  createActivityRecord,
  updateActivity,
  deleteActivity,
  pay,
} = require("../controllers/operationController");

router.route("/").get(getActivities).post(createActivityRecord);
router.route("/:id").get(getActivity).put(updateActivity).delete(deleteActivity).post(pay);

module.exports = router;