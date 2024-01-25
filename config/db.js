const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log(`DATABASE CONNECTION SUCCESSFULL ${conn.connection.host}`.bgMagenta);
  } catch (error) {
    console.log(`database not connected ${error.message}`.bgRed.white);
  }
};

module.exports = dbConnect;
