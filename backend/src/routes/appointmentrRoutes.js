const express = require("express");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

router.use(authMiddleware);

// Patient can book appointment
router.post(
  "/",
  authorizeRoles("PATIENT", "RECEPTIONIST", "ADMIN"),
  createAppointment
);

// Admin, Doctor, Receptionist can see all appointments
router.get(
  "/",
  authorizeRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
  getAppointments
);

// View individual appointment
router.get(
  "/:id",
  authorizeRoles(
    "ADMIN",
    "DOCTOR",
    "RECEPTIONIST",
    "PATIENT"
  ),
  getAppointmentById
);

// Update appointment
router.put(
  "/:id",
  authorizeRoles(
    "ADMIN",
    "DOCTOR",
    "RECEPTIONIST"
  ),
  updateAppointment
);

// Patient can cancel their appointment
router.patch(
  "/:id/cancel",
  authorizeRoles(
    "PATIENT",
    "RECEPTIONIST",
    "ADMIN"
  ),
  cancelAppointment
);

// Delete appointment
router.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  deleteAppointment
);

module.exports = router;