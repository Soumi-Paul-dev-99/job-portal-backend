const userModel = require("../models/userModels");
const asyncHandler = require("express-async-handler");
exports.updateUserController = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const { name, email, lastName, location } = req.body;
  if (!name || !email || !lastName || !location) {
    throw new Error("please provide all fields");
  }

  const user = await userModel.findById(id);
  console.log("user", user);
  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.location = location;

  await user.save();
  const token = user.createJWT();
  res.status(200).json({
    user,
    token,
  });
});
