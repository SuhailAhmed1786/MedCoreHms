const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const {sendVerificationEmail} = require("../services/emailService");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log("Received registration data:", { username, email, password });

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
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
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Token expires after 15 minutes
    const verificationExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Create user
  const user = await User.create({
    username: username.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "PATIENT",
    emailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: verificationExpires,
  });

  try {
    await sendVerificationEmail(
      user.email,
      verificationToken
    );
  } catch (emailError) {
  console.error("EMAIL ERROR:", emailError);

    return res.status(500).json({
      success: false,
      message: "Unable to send verification email",
    });
  }

  return res.status(201).json({
    success: true,
    message:
      "Registration successful. Please check your email to verify your account.",
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

}

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    console.log("Token from URL:", token);

    const userByToken = await User.findOne({
      emailVerificationToken: token,
    });

    console.log("User by token:", userByToken);

    if (!userByToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    console.log(
      "Stored expiry:",
      userByToken.emailVerificationExpires
    );

    console.log(
      "Current time:",
      new Date()
    );

    if (
      userByToken.emailVerificationExpires &&
      userByToken.emailVerificationExpires <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired",
      });
    }

    userByToken.emailVerified = true;
    userByToken.emailVerificationToken = null;
    userByToken.emailVerificationExpires = null;

    await userByToken.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check email verification
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password,user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  try {

    const user = await User.findOne({ id: user._id });

    return res.status(200).json({
      success: true,
      messsage: "Logout successfully!"

    })


  } catch (error) {
    i

  }
}


module.exports = {
  register,
  verifyEmail,
  login,
  logout      
};