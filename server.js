const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
connectDB();
const errorMiddleware = require("./middlewares/errorMiddleware");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobsRoutes = require("./routes/jobsRoutes");

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
