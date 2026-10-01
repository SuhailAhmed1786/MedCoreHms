const Patient = require("../models/Patient");

const createPatient = async (req, res, next) => {
  try {
    const {
      dateOfBirth,
      gender,
      phone,
      address,
      bloodGroup,
      emergencyContact,
    } = req.body;

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const existingPatient = await Patient.findOne({
      user: userId,
    });

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: "Patient already exists for this user",
      });
    }

    const patient = await Patient.create({
      user: userId,
      dateOfBirth,
      gender,
      phone,
      address,
      bloodGroup,
      emergencyContact,
    });

    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};


const getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find()
      .populate({
        path: "user",
        select: "name username email",
      });

    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No patients found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate({
        path: "user",
        select: "name username email",
      });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient found successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};


const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    })

  } catch (error) {
    next(error)
  }


}


const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "user",
      select: "name username email",
    });

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  deletePatient,
  updatePatient
};