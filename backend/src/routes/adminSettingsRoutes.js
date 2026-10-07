const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  getAdminSettings,
  updateAdminSettings,
} = require("../controllers/adminSettingsController");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getAdminSettings
);

router.put(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateAdminSettings
);

module.exports = router;