const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  createEMR,
  getEMRById,
  getPatientEMRs,
  updateEMR,
  deleteEMR,
} = require("../controllers/emrController");

// All EMR APIs require authentication
router.use(authMiddleware);

// Create EMR
router.post(
  "/",
  authorizeRoles("ADMIN", "DOCTOR"),
  createEMR
);

// Get EMR by ID
router.get(
  "/:id",
  authorizeRoles("ADMIN", "DOCTOR"),
  getEMRById
);

// Get all EMRs for patient
router.get(
  "/patient/:patientId",
  authorizeRoles("ADMIN", "DOCTOR"),
  getPatientEMRs
);

// Update EMR
router.put(
  "/:id",
  authorizeRoles("ADMIN", "DOCTOR"),
  updateEMR
);

// Delete EMR - Admin only
router.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  deleteEMR
);

module.exports = router;