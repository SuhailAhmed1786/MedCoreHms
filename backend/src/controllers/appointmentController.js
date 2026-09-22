const Appointment = require("../models/Appointment");

const createAppointment = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({
      user: req.user.id,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const {
      doctor,
      appointmentDate,
      reason,
    } = req.body;

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor,
      appointmentDate,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};