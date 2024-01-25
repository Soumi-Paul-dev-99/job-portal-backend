const express = require("express");
const { registerController, loginController } = require("../controllers/authController");
const router = express.Router();
router.route("/register").post(registerController);
router.route("/login").post(loginController);

module.exports = router;
