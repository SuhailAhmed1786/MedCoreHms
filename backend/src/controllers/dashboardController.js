const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Billing = require("../models/Billing");

const getDashboardData = async (req, res, next) => {
  try {
    // ================================
    // DATE RANGE - TODAY
    // ================================

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // ================================
    // TOTAL PATIENTS
    // ================================

    const totalPatients = await Patient.countDocuments();

    // ================================
    // TOTAL DOCTORS
    // ================================

    const totalDoctors = await Doctor.countDocuments();

    // ================================
    // ACTIVE DOCTORS
    // ================================

    const activeDoctors = await Doctor.countDocuments({
      available: true,
    });

    // ================================
    // TODAY'S APPOINTMENTS
    // ================================

    const todaysAppointments = await Appointment.find({
      appointmentDate: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    })
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
          select: "name username email",
        },
      })
      .sort({ appointmentDate: 1 });

    // ================================
    // TODAY'S REVENUE
    // ================================

    const todaysBills = await Billing.find({
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
      paymentStatus: {
        $ne: "CANCELLED",
      },
    });

    const todaysRevenue = todaysBills.reduce(
      (total, bill) => total + (bill.paidAmount || 0),
      0
    );

    // ================================
    // PENDING BILLING
    // ================================

    const pendingBills = await Billing.find({
      paymentStatus: {
        $in: ["PENDING", "PARTIAL"],
      },
    });

    const pendingBillsAmount = pendingBills.reduce(
      (total, bill) => {
        const remaining =
          (bill.totalAmount || 0) -
          (bill.paidAmount || 0);

        return total + remaining;
      },
      0
    );

    // ================================
    // RECENT PATIENTS
    // ================================

    const recentPatients = await Patient.find()
      .populate({
        path: "user",
        select: "name username email",
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // ================================
    // RECENT BILLING
    // ================================

    const recentBilling = await Billing.find()
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
          select: "name username email",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // ================================
    // RESPONSE
    // ================================

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",

      data: {
        statistics: {
          totalPatients,
          totalDoctors,
          activeDoctors,
          todaysAppointments: todaysAppointments.length,
          todaysRevenue,
          pendingBillsAmount,
        },

        todaysAppointments,

        recentPatients,

        recentBilling,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Error:",
      error
    );

    next(error);
  }
};

module.exports = {
  getDashboardData,
};