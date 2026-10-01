const User = require("../models/User");
const Doctor = require("../models/Doctor");

const getDoctorList = async (req, res, next) => {
  try {
    const doctorlist = await Doctor.find()
      .populate("user", "name username email role");

    return res.status(200).json({
      success: true,
      message: "Doctors found successfully",
      data: doctorlist,
    });
  } catch (error) {
    next(error);
  }
};


const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user", "name username email role");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor found successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorByUserId = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.params.userId,
    }).populate("user", "name username email role");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor found successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name username email role");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "doctor not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "doctor deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

const updateDoctorAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Updating availability for doctor ID:", id);
    const { available } = req.body;
    console.log(available);
    // Validate available value
    if (typeof available !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Available must be a boolean value",
      });
    }

    const doctor = await Doctor.findById(id).populate("user","username email role");

      if (!doctor) {
          return res.status(404).json({
              success: false,
              message: "Doctor not found",
          });
      }

    // Doctor can update only their own availability
    if (
      req.user.role === "DOCTOR" &&
      doctor.user._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this doctor's availability",
      });
    }

    doctor.available = available;
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: `Doctor is now ${available ? "available" : "unavailable"}`,
      data: {
        id: doctor._id,
        available: doctor.available
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getDoctorList,
    getDoctorById,
    getDoctorByUserId,
    updateDoctor,
    deleteDoctor,
    updateDoctorAvailability,
};