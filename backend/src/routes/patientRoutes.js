const express = require("express");

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

router.use(authMiddleware);

// Admin, Doctor, Receptionist can view patients
router.get(
  "/",
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  getPatients
);

// Create patient
router.post(
  "/",
  authorizeRoles("ADMIN", "RECEPTIONIST", "PATIENT"),
  createPatient
);

// View patient
router.get(
  "/:id",
  authorizeRoles(
    "ADMIN",
    "DOCTOR",
    "RECEPTIONIST",
    "PATIENT"
  ),
  getPatientById
);

// // Update patient
// router.put(
//   "/:id",
//   authorizeRoles(
//     "ADMIN",
//     "DOCTOR",
//     "RECEPTIONIST",
//     "PATIENT"
//   ),
//   updatePatient
// );

// // Delete patient
// router.delete(
//   "/:id",
//   authorizeRoles("ADMIN", "RECEPTIONIST"),
//   deletePatient
// );
module.exports = router;