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

    console.log("Authenticated user:", req.user);
    console.log("User ID:", req.user?.userId);

    const patient = await Patient.create({
      user: req.user.userId,

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
  const patient = await Patient.find(req.body)

  try {
    if (!patient) {
      return res.status(404).json({
        success: true,
        // data: patient,
        message: "Patient not found",
      })
    }

    else {
      return res.status(200).json({
        data: patient,
        success: false,
        message: "Get All data successfully",

      })
    }

  } catch (error) {
    next(error);

  }
}


const getPatientById = async (req, res, next) => {
  try {

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    else {
      return res.status(200).json({
        success: true,
        message: "Patient found successfully",
        data: patient,
      });
    }

  } catch (error) {
    next(error);
  }
}


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


module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  deletePatient
};