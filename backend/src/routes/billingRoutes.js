const express = require("express");

const {
  createBilling,
  getAllBillings,
  getBillingById,
  getPatientBillings,
  updateBilling,
  recordPayment,
  cancelBilling
} = require("../controllers/billingController");

const router = express.Router();

router.post("/", createBilling);
router.get("/", getAllBillings);
router.get("/patient/:patientId", getPatientBillings);
router.get("/:id", getBillingById);
router.patch("/:id", updateBilling);
router.patch("/:id/payment", recordPayment);
router.delete("/:id", cancelBilling);

module.exports = router;