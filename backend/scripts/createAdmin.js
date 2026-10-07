const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();

const User = require("../src/models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({
      role: "ADMIN",
    });

    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const admin = await User.create({
      name: "System Admin",
      username: "admin",
      email: "ahmed.suhail42@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 15 * 60 * 1000), // Token expires after 15 minutes
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Verification Token:", verificationToken);
    console.log(`Verification URL: http://localhost:5173/verify-email/${verificationToken}`);

    process.exit(0);
  } catch (error) {
    console.error("Create Admin Error:", error);
    process.exit(1);
  }
};

createAdmin();