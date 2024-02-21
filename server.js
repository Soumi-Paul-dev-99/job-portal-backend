//packages import
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
//security packages
const helmet = require("helmet");
const xss = require("xss-clean");
const mongooseSanitize = require("express-mongo-sanitize")
//files imports
const connectDB = require("./config/db");

//mongodb connection
connectDB();
const errorMiddleware = require("./middlewares/errorMiddleware");
//routes import
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobsRoutes = require("./routes/jobsRoutes");

//middlewares
app.use(xss());
app.use(helmet());
app.use(mongooseSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(
    `server running on ${process.env.DEV_MODE} the port http://localhost:${port}`
      .bgCyan.white
  );
});
