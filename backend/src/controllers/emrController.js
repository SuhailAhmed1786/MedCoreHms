
const mongoose = require("mongoose");

const EMR = require("../models/EMR");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// CREATE EMR
const createEMR = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      appointment,
      symptoms,
      diagnosis,
      medicalHistory,
      allergies,
      medications,
      vitals,
      clinicalNotes,
      treatmentPlan,
      followUpDate,
    } = req.body;

    // Required fields
    if (!patient || !doctor || !appointment) {
      return res.status(400).json({
        success: false,
        message: "Patient, doctor and appointment are required",
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
    const appointmentExists = await Appointment.findById(
      appointment
    );

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
          "Appointment does not belong to the selected patient and doctor",
      });
    }

    // EMR should be created after consultation
    if (appointmentExists.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message:
          "EMR can only be created for a completed appointment",
      });
    }

    // Prevent duplicate EMR for same appointment
    const existingEMR = await EMR.findOne({
      appointment,
    });

    if (existingEMR) {
      return res.status(409).json({
        success: false,
        message: "EMR already exists for this appointment",
      });
    }

    const emr = await EMR.create({
      patient,
      doctor,
      appointment,
      symptoms,
      diagnosis,
      medicalHistory,
      allergies,
      medications,
      vitals,
      clinicalNotes,
      treatmentPlan,
      followUpDate,
    });

    const populatedEMR = await EMR.findById(emr._id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .populate("appointment");

    return res.status(201).json({
      success: true,
      message: "EMR created successfully",
      data: populatedEMR,
    });
  } catch (error) {
    console.error("Create EMR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create EMR",
      error: error.message,
    });
  }
};


// GET EMR BY ID
const getEMRById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid EMR ID",
      });
    }

    const emr = await EMR.findById(id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .populate("appointment");

    if (!emr) {
      return res.status(404).json({
        success: false,
        message: "EMR not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: emr,
    });
  } catch (error) {
    console.error("Get EMR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get EMR",
      error: error.message,
    });
  }
};


// GET ALL EMRs FOR PATIENT
const getPatientEMRs = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const emrs = await EMR.find({
      patient: patientId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .populate("appointment");

    return res.status(200).json({
      success: true,
      count: emrs.length,
      data: emrs,
    });
  } catch (error) {
    console.error("Get Patient EMRs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get patient EMRs",
      error: error.message,
    });
  }
};


// UPDATE EMR
const updateEMR = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid EMR ID",
      });
    }

    const emr = await EMR.findById(id);

    if (!emr) {
      return res.status(404).json({
        success: false,
        message: "EMR not found",
      });
    }

    const allowedFields = [
      "symptoms",
      "diagnosis",
      "medicalHistory",
      "allergies",
      "medications",
      "vitals",
      "clinicalNotes",
      "treatmentPlan",
      "followUpDate",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        emr[field] = req.body[field];
      }
    });

    await emr.save();

    const updatedEMR = await EMR.findById(emr._id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "username email",
        },
      })
      .populate("appointment");

    return res.status(200).json({
      success: true,
      message: "EMR updated successfully",
      data: updatedEMR,
    });
  } catch (error) {
    console.error("Update EMR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update EMR",
      error: error.message,
    });
  }
};


// DELETE EMR
const deleteEMR = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid EMR ID",
      });
    }

    const emr = await EMR.findById(id);

    if (!emr) {
      return res.status(404).json({
        success: false,
        message: "EMR not found",
      });
    }

    await EMR.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "EMR deleted successfully",
    });
  } catch (error) {
    console.error("Delete EMR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete EMR",
      error: error.message,
    });
  }
};


module.exports = {
  createEMR,
  getEMRById,
  getPatientEMRs,
  updateEMR,
  deleteEMR,
};