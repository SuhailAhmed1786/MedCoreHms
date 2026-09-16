// getting-started.js
const mongoose = require('mongoose');
require("dotenv").config();
main().catch(err => console.log(err));

async function main() {
  mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });
}