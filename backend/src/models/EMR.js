const mongoose = require("mongoose");

const emrSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true, },
    symptoms: { type: String, trim: true, maxlength: 1000, }, diagnosis: { type: String, trim: true, maxlength: 1000, },
    medicalHistory: { type: String, trim: true, maxlength: 2000, }, allergies: [{ type: String, trim: true, },],
    medications: [{
        name: { type: String, trim: true, required: true, }, dosage: { type: String, trim: true, },
        frequency: { type: String, trim: true, }, duration: { type: String, trim: true, },
    },],
    vitals: { temperature: Number, bloodPressure: String, heartRate: Number, respiratoryRate: Number, oxygenSaturation: Number, weight: Number, height: Number, },
    clinicalNotes: { type: String, trim: true, maxlength: 3000, },
    treatmentPlan: { type: String, trim: true, maxlength: 3000, },
    followUpDate: { type: Date, },
}, { timestamps: true, }); emrSchema.index({ patient: 1 }); emrSchema.index({ appointment: 1 });

module.exports = mongoose.model("EMR", emrSchema);