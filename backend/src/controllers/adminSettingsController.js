const AdminSettings = require("../models/AdminSettings");

// =====================================================
// GET ADMIN SETTINGS
// =====================================================

const getAdminSettings = async (req, res, next) => {
  try {
    let settings = await AdminSettings.findOne();

    // Create default settings if nothing exists
    if (!settings) {
      settings = await AdminSettings.create({
        hospitalName: "MedCore Hospital",
        email: "",
        phone: "",
        address: "",
        appointmentNotifications: true,
        billingNotifications: true,
        emailNotifications: true,
        updatedBy: req.user?._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin settings fetched successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Get Admin Settings Error:", error);
    next(error);
  }
};


// =====================================================
// UPDATE ADMIN SETTINGS
// =====================================================

const updateAdminSettings = async (req, res, next) => {
  try {
    const {
      hospitalName,
      email,
      phone,
      address,
      appointmentNotifications,
      billingNotifications,
      emailNotifications,
    } = req.body;

    // Basic validation
    if (!hospitalName || !hospitalName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hospital name is required",
      });
    }

    let settings = await AdminSettings.findOne();

    // Create if settings don't exist
    if (!settings) {
      settings = new AdminSettings();
    }

    settings.hospitalName = hospitalName.trim();
    settings.email = email?.trim() || "";
    settings.phone = phone?.trim() || "";
    settings.address = address?.trim() || "";

    settings.appointmentNotifications =
      appointmentNotifications ?? true;

    settings.billingNotifications =
      billingNotifications ?? true;

    settings.emailNotifications =
      emailNotifications ?? true;

    if (req.user?._id) {
      settings.updatedBy = req.user._id;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Admin settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Update Admin Settings Error:", error);
    next(error);
  }
};


module.exports = {
  getAdminSettings,
  updateAdminSettings,
};