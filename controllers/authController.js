const userModel = require("../models/userModels");
const asyncHandler = require("express-async-handler");

exports.registerController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //validate
  if (!name) {
    res.send("name is required");
  }
  if (!email) {
    res.send("email is required");
  }
  if (!password) {
    res.send("password is required");
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(200).send({
      success: false,
      message: "Email already register please login",
    });
  }
  const user = await userModel.create({ name, email, password });
  //token
  const token = user.createJWT();
  res.status(201).send({
    success: true,
    message: "User created successfully",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
});

exports.loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("please provide all fields");
  }

  //find user by email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid username or password");
  }

  //compare passsword
  const ismatch = await user.comparePassword(password);
  if (!ismatch) {
    throw new Error("invalid username or password");
  }
  user.password = undefined;
  const token = user.createJWT();

  res.status(200).json({
    success: true,
    message: "login successfully",
    user,
    token,
  });
});
