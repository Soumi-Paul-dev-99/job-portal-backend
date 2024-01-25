const JWT = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModels = require("../models/userModels");
const userAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      req.user = await userModels.findById(decoded.id);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("not authorizes");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("not authorized,no token");
  }
});

module.exports = userAuth;
