require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("./src/models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({
      email: "admin@medcore.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      12
    );

    const admin = await User.create({
      username: "MedCore Admin",
      email: "admin@medcore.com",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: true,
    });

    console.log("Admin created successfully");

    console.log({
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};


  createAdmin();