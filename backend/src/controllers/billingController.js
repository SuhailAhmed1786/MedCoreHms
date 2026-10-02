const mongoose = require("mongoose");

const Billing = require("../models/Billing");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const createBilling = async (req, res, next) => {
  try {
    const {
      patient,
      doctor,
      appointment,
      items,
      discount = 0,
      tax = 0,
      paymentMethod,
      paidAmount = 0,
      notes,
    } = req.body;

    // Required fields
    if (!patient || !doctor || !appointment) {
      return res.status(400).json({
        success: false,
        message: "Patient, doctor and appointment are required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one billing item is required",
      });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(patient) ||
      !mongoose.Types.ObjectId.isValid(doctor) ||
      !mongoose.Types.ObjectId.isValid(appointment)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient, doctor or appointment ID",
      });
    }

    // Check patient
    const patientExists = await Patient.findById(patient);

    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check doctor
    const doctorExists = await Doctor.findById(doctor);

    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check appointment
    const appointmentExists = await Appointment.findById(appointment);

    if (!appointmentExists) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Make sure appointment belongs to patient and doctor
    if (
      appointmentExists.patient.toString() !== patient ||
      appointmentExists.doctor.toString() !== doctor
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment does not belong to selected patient and doctor",
      });
    }

    // Billing after completed appointment
    if (appointmentExists.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Billing can only be created for a completed appointment",
      });
    }

    // Prevent duplicate bill
    const existingBilling = await Billing.findOne({
      appointment,
    });

    if (existingBilling) {
      return res.status(409).json({
        success: false,
        message: "Billing already exists for this appointment",
      });
    }

    // Calculate subtotal
    const subtotal = items.reduce((total, item) => {
      const quantity = Number(item.quantity);
      const amount = Number(item.amount);

      if (
        !Number.isFinite(quantity) ||
        !Number.isFinite(amount) ||
        quantity <= 0 ||
        amount < 0
      ) {
        return total;
      }

      return total + quantity * amount;
    }, 0);

    const discountAmount = Number(discount);
    const taxAmount = Number(tax);
    const paid = Number(paidAmount);

    if (
      !Number.isFinite(discountAmount) ||
      !Number.isFinite(taxAmount) ||
      !Number.isFinite(paid)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount, tax or paid amount",
      });
    }

    const totalAmount =
      subtotal - discountAmount + taxAmount;

    if (totalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount cannot be negative",
      });
    }

    if (paid < 0 || paid > totalAmount) {
      return res.status(400).json({
        success: false,
        message:
          "Paid amount cannot be negative or greater than total amount",
      });
    }

    // Determine payment status
    let paymentStatus = "PENDING";

    if (paid === totalAmount && totalAmount > 0) {
      paymentStatus = "PAID";
    } else if (paid > 0 && paid < totalAmount) {
      paymentStatus = "PARTIAL";
    }

    const billing = await Billing.create({
      patient,
      doctor,
      appointment,
      items,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      totalAmount,
      paidAmount: paid,
      paymentStatus,
      paymentMethod,
      paymentDate: paid > 0 ? new Date() : undefined,
      notes,
    });

    const populatedBilling = await Billing.findById(billing._id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name username email",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate("appointment");

    return res.status(201).json({
      success: true,
      message: "Billing created successfully",
      data: populatedBilling,
    });
  } catch (error) {
    console.error("Create Billing Error:", error);
    next(error);
  }
};

const getAllBillings = async (req, res, next) => {
  try {
    const billings = await Billing.find()
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name username email",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate("appointment")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Billing records fetched successfully",
      count: billings.length,
      data: billings,
    });
  } catch (error) {
    console.error("Get All Billings Error:", error);
    next(error);
  }
};

const getBillingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid billing ID",
      });
    }

    const billing = await Billing.findById(id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate("appointment");

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Billing record fetched successfully",
      data: billing,
    });
  } catch (error) {
    console.error("Get Billing By ID Error:", error);
    next(error);
  }
};

const getPatientBillings = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patientExists = await Patient.findById(patientId);

    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const billings = await Billing.find({
      patient: patientId,
    })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate("appointment")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Patient billing history fetched successfully",
      count: billings.length,
      data: billings,
    });
  } catch (error) {
    console.error("Get Patient Billings Error:", error);
    next(error);
  }
};

const updateBilling = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid billing ID",
      });
    }

    const billing = await Billing.findById(id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing record not found",
      });
    }

    // Prevent editing a cancelled bill
    if (billing.paymentStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cancelled billing cannot be updated",
      });
    }

    const {
      items,
      discount,
      tax,
      paidAmount,
      paymentMethod,
      notes,
    } = req.body;

    // --------------------------------
    // Validate items
    // --------------------------------

    if (items !== undefined) {
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one billing item is required",
        });
      }

      for (const item of items) {
        const quantity = Number(item.quantity);
        const amount = Number(item.amount);

        if (
          !Number.isFinite(quantity) ||
          quantity <= 0 ||
          !Number.isFinite(amount) ||
          amount < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Each billing item must have a valid quantity and amount",
          });
        }
      }
    }

    // --------------------------------
    // Calculate subtotal
    // --------------------------------

    const updatedItems = items !== undefined ? items : billing.items;

    const subtotal = updatedItems.reduce((total, item) => {
      return total + Number(item.quantity) * Number(item.amount);
    }, 0);

    // --------------------------------
    // Discount and tax
    // --------------------------------

    const updatedDiscount =
      discount !== undefined
        ? Number(discount)
        : billing.discount;

    const updatedTax =
      tax !== undefined
        ? Number(tax)
        : billing.tax;

    if (
      !Number.isFinite(updatedDiscount) ||
      updatedDiscount < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount",
      });
    }

    if (
      !Number.isFinite(updatedTax) ||
      updatedTax < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid tax",
      });
    }

    // --------------------------------
    // Calculate total
    // --------------------------------

    const totalAmount =
      subtotal - updatedDiscount + updatedTax;

    if (totalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount cannot be negative",
      });
    }

    // --------------------------------
    // Paid amount
    // --------------------------------

    const updatedPaidAmount =
      paidAmount !== undefined
        ? Number(paidAmount)
        : billing.paidAmount;

    if (
      !Number.isFinite(updatedPaidAmount) ||
      updatedPaidAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid paid amount",
      });
    }

    if (updatedPaidAmount > totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot be greater than total amount",
      });
    }

    // --------------------------------
    // Payment status
    // --------------------------------

    let paymentStatus = "PENDING";

    if (updatedPaidAmount === totalAmount && totalAmount > 0) {
      paymentStatus = "PAID";
    } else if (
      updatedPaidAmount > 0 &&
      updatedPaidAmount < totalAmount
    ) {
      paymentStatus = "PARTIAL";
    }

    // --------------------------------
    // Update billing
    // --------------------------------

    billing.items = updatedItems;
    billing.subtotal = subtotal;
    billing.discount = updatedDiscount;
    billing.tax = updatedTax;
    billing.totalAmount = totalAmount;
    billing.paidAmount = updatedPaidAmount;
    billing.paymentStatus = paymentStatus;

    if (paymentMethod !== undefined) {
      billing.paymentMethod = paymentMethod;
    }

    if (notes !== undefined) {
      billing.notes = notes;
    }

    if (updatedPaidAmount > 0 && !billing.paymentDate) {
      billing.paymentDate = new Date();
    }

    await billing.save();

    // --------------------------------
    // Populate response
    // --------------------------------

    const populatedBilling = await Billing.findById(billing._id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate("appointment");

    return res.status(200).json({
      success: true,
      message: "Billing updated successfully",
      data: populatedBilling,
    });
  } catch (error) {
    console.error("Update Billing Error:", error);
    next(error);
  }
};

const recordPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, notes } = req.body;

    // Validate billing ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid billing ID",
      });
    }

    // Validate payment amount
    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    // Find billing
    const billing = await Billing.findById(id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing record not found",
      });
    }

    // Don't allow payment on cancelled bill
    if (billing.paymentStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cannot make payment for a cancelled bill",
      });
    }

    // Don't allow payment if already fully paid
    if (billing.paidAmount >= billing.totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Billing is already fully paid",
      });
    }

    // Calculate new paid amount
    const newPaidAmount =
      Number(billing.paidAmount) + paymentAmount;

    // Don't allow overpayment
    if (newPaidAmount > billing.totalAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment exceeds remaining amount. Remaining amount is ${
          billing.totalAmount - billing.paidAmount
        }`,
      });
    }

    // Calculate payment status
    let paymentStatus = "PENDING";

    if (newPaidAmount === billing.totalAmount) {
      paymentStatus = "PAID";
    } else if (newPaidAmount > 0) {
      paymentStatus = "PARTIAL";
    }

    // Update billing
    billing.paidAmount = newPaidAmount;
    billing.paymentStatus = paymentStatus;
    billing.paymentMethod = paymentMethod || billing.paymentMethod;
    billing.paymentDate = new Date();

    if (notes !== undefined) {
      billing.notes = notes;
    }

    await billing.save();

    // Populate response
    const populatedBilling = await Billing.findById(billing._id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate("appointment");

    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
      data: populatedBilling,
    });
  } catch (error) {
    console.error("Record Payment Error:", error);
    next(error);
  }
};

const cancelBilling = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate billing ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid billing ID",
      });
    }

    // Find billing
    const billing = await Billing.findById(id);

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: "Billing record not found",
      });
    }

    // Already cancelled
    if (billing.paymentStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Billing is already cancelled",
      });
    }

    // Don't cancel a fully paid bill
    if (billing.paymentStatus === "PAID") {
      return res.status(400).json({
        success: false,
        message: "A fully paid bill cannot be cancelled",
      });
    }

    billing.paymentStatus = "CANCELLED";

    await billing.save();

    // Populate response
    const populatedBilling = await Billing.findById(billing._id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name username email role",
        },
      })
      .populate("appointment");

    return res.status(200).json({
      success: true,
      message: "Billing cancelled successfully",
      data: populatedBilling,
    });
  } catch (error) {
    console.error("Cancel Billing Error:", error);
    next(error);
  }
};

module.exports = {
  createBilling,
  getAllBillings,
  getBillingById,
  getPatientBillings,
  updateBilling,
  recordPayment,
  cancelBilling

};