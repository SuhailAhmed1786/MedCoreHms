const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const createAppointment = async (req, res, next) => {
  try {
    const {
      patient,
      doctor,
      appointmentDate,
      reason,
    } = req.body;

    // Required fields
    if (!patient || !doctor || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message:
          "Patient, doctor and appointment date are required",
      });
    }

    // Validate date
    const date = new Date(appointmentDate);

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date",
      });
    }

    // Don't allow past appointments
    if (date <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment date must be in the future",
      });
    }

    // Check patient
    const patientExists = await Patient.findById(
      patient
    );

    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check doctor
    const doctorExists = await Doctor.findById(
      doctor
    );

    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check doctor availability
    if (!doctorExists.available) {
      return res.status(400).json({
        success: false,
        message: "Doctor is currently unavailable",
      });
    }

    // Prevent double booking
    const existingAppointment =
      await Appointment.findOne({
        doctor,
        appointmentDate: date,
        status: {
          $in: ["SCHEDULED"],
        },
      });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "Doctor already has an appointment at this time",
      });
    }

    // Create appointment
    const appointment =
      await Appointment.create({
        patient,
        doctor,
        appointmentDate: date,
        reason: reason?.trim() || "",
        status: "SCHEDULED",
      });

    // Return populated appointment
    const populatedAppointment =
      await Appointment.findById(
        appointment._id
      )
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

    return res.status(201).json({
      success: true,
      message:
        "Appointment booked successfully",
      data: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
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
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
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

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      doctor,
      appointmentDate,
      reason,
    } = req.body;

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Don't modify cancelled/completed appointments
    if (
      ["CANCELLED", "COMPLETED"].includes(
        appointment.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled or completed appointments cannot be updated",
      });
    }

    // Validate doctor
    if (doctor) {
      const doctorExists =
        await Doctor.findById(doctor);

      if (!doctorExists) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }

      if (!doctorExists.available) {
        return res.status(400).json({
          success: false,
          message: "Doctor is currently unavailable",
        });
      }
    }

    // Validate appointment date
    let newDate = appointment.appointmentDate;

    if (appointmentDate) {
      newDate = new Date(appointmentDate);

      if (Number.isNaN(newDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid appointment date",
        });
      }

      if (newDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message:
            "Appointment date must be in the future",
        });
      }
    }

    const newDoctor =
      doctor || appointment.doctor;

    // Prevent double booking
    const existingAppointment =
      await Appointment.findOne({
        _id: { $ne: id },
        doctor: newDoctor,
        appointmentDate: newDate,
        status: "SCHEDULED",
      });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "Doctor already has an appointment at this time",
      });
    }

    appointment.doctor = newDoctor;
    appointment.appointmentDate = newDate;

    if (reason !== undefined) {
      appointment.reason = reason.trim();
    }

    await appointment.save();

    const updatedAppointment =
      await Appointment.findById(id)
        .populate({
          path: "patient",
          select: "name phone email",
        })
        .populate({
          path: "doctor",
          populate: {
            path: "user",
            select: "username email",
          },
        });

    return res.status(200).json({
      success: true,
      message:
        "Appointment updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "SCHEDULED",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
    ];

    // Validate status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    // Find appointment
    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Prevent changing completed/cancelled appointments
    if (
      ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(
        appointment.status
      ) &&
      status !== appointment.status
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Finalized appointment status cannot be changed",
      });
    }

    // Update status
    appointment.status = status;

    await appointment.save();

    // Return populated appointment
    const updatedAppointment =
      await Appointment.findById(id)
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

    return res.status(200).json({
      success: true,
      message:
        "Appointment status updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Don't permanently delete completed appointments
    if (appointment.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message:
          "Completed appointments cannot be deleted",
      });
    }

    await Appointment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Appointment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
};