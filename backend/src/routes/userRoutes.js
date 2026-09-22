const express = require("express");

const {
  createStaffUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

// All user-management routes require authentication
router.use(authMiddleware);

// Only ADMIN can create staff
router.post("/staff", authorizeRoles("ADMIN"),createStaffUser);

module.exports = router;