import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./EditAppointment.css";

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "Scheduled",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

//   const token = localStorage.getItem("auth_token");

  // Fetch appointment
  const fetchAppointment = async () => {
    try {
      const response = await api.get(
        api.get(`/appointments/${id}`));

      const appointment = response.data.data || response.data;

      setFormData({
        patient:
          appointment.patient?._id ||
          appointment.patient ||
          "",

        doctor:
          appointment.doctor?._id ||
          appointment.doctor ||
          "",

        appointmentDate: appointment.appointmentDate
          ? appointment.appointmentDate.substring(0, 10)
          : "",

        appointmentTime:
          appointment.appointmentTime || "",

        reason:
          appointment.reason || "",

        status:
          appointment.status || "Scheduled",
      });
    } catch (err) {
      console.error("Appointment error:", err);
      setError("Unable to load appointment details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const response = await api.get("/patients");
    
      setPatients(response.data.data || response.data);
    } catch (err) {
      console.error("Patients error:", err);
    }
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await api.get("/doctors");

      setDoctors(response.data.data || response.data);
    } catch (err) {
      console.error("Doctors error:", err);
    }
  };

  useEffect(() => {
    fetchAppointment();
    fetchPatients();
    fetchDoctors();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await api.put(`/appointments/${id}`,
        formData);

      alert("Appointment updated successfully!");

      navigate("/appointments");
    } catch (err) {
      console.error("Update appointment error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update appointment."
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusClass = () => {
    switch (formData.status) {
      case "Confirmed":
        return "status-confirmed";

      case "Completed":
        return "status-completed";

      case "Cancelled":
        return "status-cancelled";

      case "No Show":
        return "status-noshow";

      default:
        return "status-scheduled";
    }
  };

  if (loading) {
    return (
      <div className="edit-appointment-loading">
        <div className="loading-spinner"></div>
        <p>Loading appointment details...</p>
      </div>
    );
  }

  return (
    <div className="edit-appointment-page">

      {/* Page Header */}
      <div className="edit-page-header">

        <div className="header-left">

          <button
            className="back-button"
            onClick={() => navigate("/appointments")}
          >
            ←
          </button>

          <div>
            <h1>Edit Appointment</h1>
            <p>
              Update appointment information and scheduling details
            </p>
          </div>

        </div>

        <div className={`appointment-status ${getStatusClass()}`}>
          <span className="status-dot"></span>
          {formData.status}
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="form-error">
          <span>⚠</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="edit-layout">

          {/* LEFT SIDE */}
          <div className="edit-main">

            {/* Patient & Doctor */}
            <div className="form-card">

              <div className="card-header">
                <div className="card-icon">
                  👤
                </div>

                <div>
                  <h2>Appointment Participants</h2>
                  <p>
                    Select the patient and healthcare provider
                  </p>
                </div>
              </div>

              <div className="form-grid">

                {/* Patient */}
                <div className="form-field">

                  <label>
                    Patient
                    <span>*</span>
                  </label>

                  <select
                    name="patient"
                    value={formData.patient}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select patient
                    </option>

                    {patients.map((patient) => (
                      <option
                        key={patient._id}
                        value={patient._id}
                      >
                        {patient.user.username} - {patient.user.username}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Doctor */}
                <div className="form-field">

                  <label>
                    Doctor
                    <span>*</span>
                  </label>

                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select doctor
                    </option>

                    {doctors.map((doctor) => (
                      <option
                        key={doctor._id}
                        value={doctor._id}
                      >
                        {doctor.user.username} - {doctor.user.name}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

            </div>

            {/* Schedule */}
            <div className="form-card">

              <div className="card-header">

                <div className="card-icon">
                  📅
                </div>

                <div>
                  <h2>Appointment Schedule</h2>
                  <p>
                    Set the date and time for the appointment
                  </p>
                </div>

              </div>

              <div className="form-grid">

                {/* Date */}
                <div className="form-field">

                  <label>
                    Appointment Date
                    <span>*</span>
                  </label>

                  <div className="input-icon-wrapper">

                    <span className="input-icon">
                      📅
                    </span>

                    <input
                      type="date"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* Time */}
                <div className="form-field">

                  <label>
                    Appointment Time
                    <span>*</span>
                  </label>

                  <div className="input-icon-wrapper">

                    <span className="input-icon">
                      🕐
                    </span>

                    <input
                      type="time"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* Reason */}
            <div className="form-card">

              <div className="card-header">

                <div className="card-icon">
                  📝
                </div>

                <div>
                  <h2>Appointment Reason</h2>
                  <p>
                    Provide details about the patient's visit
                  </p>
                </div>

              </div>

              <div className="form-field">

                <label>
                  Reason / Notes
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Enter the reason for the appointment..."
                  rows="5"
                />

                <div className="field-hint">
                  Add symptoms, consultation reason, or other
                  relevant information.
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="edit-sidebar">

            {/* Status */}
            <div className="form-card status-card">

              <div className="card-header">

                <div className="card-icon">
                  🔄
                </div>

                <div>
                  <h2>Appointment Status</h2>
                  <p>
                    Update current status
                  </p>
                </div>

              </div>

              <div className="form-field">

                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Scheduled">
                    Scheduled
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                  <option value="No Show">
                    No Show
                  </option>
                </select>

              </div>

              <div
                className={`status-preview ${getStatusClass()}`}
              >
                <span className="status-dot"></span>

                <div>
                  <strong>
                    {formData.status}
                  </strong>

                  <p>
                    Current appointment status
                  </p>
                </div>
              </div>

            </div>

            {/* Information */}
            <div className="form-card info-card">

              <div className="card-header">

                <div className="card-icon">
                  ℹ️
                </div>

                <div>
                  <h2>Appointment Info</h2>
                </div>

              </div>

              <div className="info-row">
                <span>Appointment ID</span>
                <strong>
                  #{id?.slice(-8)}
                </strong>
              </div>

              <div className="info-row">
                <span>Patient</span>
                <strong>
                  {patients.find(
                    (p) => p._id === formData.patient
                  )?.name || "Not selected"}
                </strong>
              </div>

              <div className="info-row">
                <span>Doctor</span>
                <strong>
                  {doctors.find(
                    (d) => d._id === formData.doctor
                  )?.name || "Not selected"}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Actions */}
        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/appointments")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="update-button"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="button-spinner"></span>
                Updating...
              </>
            ) : (
              <>
                ✓ Update Appointment
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditAppointment;

