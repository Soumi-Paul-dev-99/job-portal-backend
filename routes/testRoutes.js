const express = require("express");
const { testPostController } = require("../controllers/testController");
const userAuth = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/test-post").post(userAuth,testPostController);

module.exports = router;
