const express = require("express");
const userAuth = require("../middlewares/authMiddleware");
const {
  createJobController,
  getAlljobs,
  updateJobController,
  deleteJobController,
  jobStatsController,
} = require("../controllers/jobsController");

const router = express.Router();

// routes
// create job || post
router.post("/create-job", userAuth, createJobController);

//get jobs || get
router.get("/get-job", userAuth, getAlljobs);

//update jobs || put || patch
router.put("/update-job/:id", userAuth, updateJobController);
//delete jobs || delete || delete
router.delete("/delete-job/:id", userAuth, deleteJobController);
//jobs stats filter || get
router.get("/job-stats", userAuth, jobStatsController);

module.exports = router;
