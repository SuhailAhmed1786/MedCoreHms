const express = require("express");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
} = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  authorizeRoles(
    "ADMIN",
    "DOCTOR",
    "RECEPTIONIST"
  ),
  createAppointment
);

router.get(
  "/",
  authorizeRoles(
    "ADMIN",
    "DOCTOR",
    "RECEPTIONIST"
  ),
  getAppointments
);

router.get(
  "/:id",
  authorizeRoles(
    "ADMIN",
    "DOCTOR",
    "RECEPTIONIST"
  ),
  getAppointmentById
);

router.put(
  "/:id",
  authorizeRoles(
    "ADMIN",
    "DOCTOR",
    "RECEPTIONIST"
  ),
  updateAppointment
);

router.patch(
  "/:id/status",
  authorizeRoles(
    "ADMIN",
    "DOCTOR",
    "RECEPTIONIST"
  ),
  updateAppointmentStatus
);

router.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  deleteAppointment
);

module.exports = router;