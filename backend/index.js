const express = require("express");
const mydb = require("./config/database.js");
require('dotenv').config();
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MedCore HMS API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/uploads",express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
  res.send("Express server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});