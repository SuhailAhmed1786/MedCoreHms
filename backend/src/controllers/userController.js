const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const createStaffUser = async (req, res, next) => {
  let createdUser = null;

  try {
    const {
      username,
      email,
      password,
      role,

      // Doctor fields
      specialization,
      qualification,
      licenseNumber,
      phone,
      consultationFee,
    } = req.body;

    // Required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Username, email, password and role are required",
      });
    }

    // Only these staff roles can be created
    if (!["DOCTOR", "RECEPTIONIST"].includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Only DOCTOR or RECEPTIONIST users can be created",
      });
    }

    // Password validation
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

    // Doctor-specific validation
    if (role === "DOCTOR") {
      if (
        !specialization ||
        !qualification ||
        !licenseNumber
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Specialization, qualification and license number are required for doctors",
        });
      }

      // Check duplicate license
      const existingLicense = await Doctor.findOne({
        licenseNumber: licenseNumber.trim(),
      });

      if (existingLicense) {
        return res.status(409).json({
          success: false,
          message: "License number is already registered",
        });
      }

      // Validate consultation fee
      if (
        consultationFee !== undefined &&
        consultationFee !== "" &&
        Number.isNaN(Number(consultationFee))
      ) {
        return res.status(400).json({
          success: false,
          message: "Consultation fee must be a valid number",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // Create User
    createdUser = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      emailVerified: true,
    });

    // Create Doctor profile
    if (role === "DOCTOR") {
      try {
        await Doctor.create({
          user: createdUser._id,
          specialization: specialization.trim(),
          qualification: qualification.trim(),
          licenseNumber: licenseNumber.trim(),
          phone: phone?.trim() || "",
          consultationFee:
            consultationFee !== undefined &&
            consultationFee !== ""
              ? Number(consultationFee)
              : undefined,
          available: true,
        });
      } catch (doctorError) {
        // Remove User if Doctor creation fails
        await User.findByIdAndDelete(
          createdUser._id
        );

        throw doctorError;
      }
    }

    return res.status(201).json({
      success: true,
      message: `${role} account created successfully`,

      data: {
        id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
        emailVerified: createdUser.emailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStaffUser,
};