const express = require("express");

const { getDoctorList, getDoctorById, updateDoctor, deleteDoctor, updateDoctorAvailability } = require("../controllers/doctorController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("ADMIN", "RECEPTIONIST"), getDoctorList);
router.get("/:id", authorizeRoles("ADMIN", "RECEPTIONIST"), getDoctorById);
router.put("/:id", authorizeRoles("ADMIN", "RECEPTIONIST"), updateDoctor);
router.delete("/:id", authorizeRoles("ADMIN", "RECEPTIONIST"), deleteDoctor);

router.patch("/:id/availability", authorizeRoles("ADMIN", "DOCTOR"), updateDoctorAvailability);

module.exports = router;