const express = require("express");

const {
  createPatient,
  getPatients,
  getPatientById,
//   updatePatient,
//   deletePatient,
} = require("../controllers/patientController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All patient routes require authentication
router.use(authMiddleware);

// Create patient
router.post("/", createPatient);

// Get all patients
router.get("/", getPatients);

// // Get single patient
router.get("/:id", getPatientById);

// // Update patient
// router.put("/:id", updatePatient);

// // Delete patient
// router.delete("/:id", deletePatient);

module.exports = router;