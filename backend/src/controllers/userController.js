const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createStaffUser = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      role,
    } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Username, email, password and role are required",
      });
    }

    // Only staff roles can be created through this API
    const allowedRoles = [
      "DOCTOR",
      "RECEPTIONIST",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Only DOCTOR or RECEPTIONIST users can be created",
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // Create staff user
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      emailVerified: true,
    });

    return res.status(201).json({
      success: true,
      message: `${role} account created successfully`,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStaffUser,
};