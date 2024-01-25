const bcryptjs = require("bcryptjs");

exports.hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

exports.comparePassword = (password, hashedPassword) => {
  return bcryptjs.compare(password, hashedPassword);
};
