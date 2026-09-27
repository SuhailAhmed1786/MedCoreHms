
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPatientsAndDoctors();
  }, []);

  const fetchPatientsAndDoctors = async () => {
    try {
      setLoadingData(true);
      setError("");

      const [patientsResponse, doctorsResponse] =
        await Promise.all([
          api.get("/patients"),
          api.get("/doctors"),
        ]);

      setPatients(
        patientsResponse.data.data || []
      );

      setDoctors(
        doctorsResponse.data.data || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load patients and doctors"
      );
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.patient ||
      !formData.doctor ||
      !formData.appointmentDate ||
      !formData.appointmentTime
    ) {
      setError(
        "Patient, doctor, date and time are required"
      );
      return;
    }

    const appointmentDateTime = new Date(
      `${formData.appointmentDate}T${formData.appointmentTime}`
    );

    if (Number.isNaN(appointmentDateTime.getTime())) {
      setError("Please enter a valid appointment date and time");
      return;
    }

    if (appointmentDateTime <= new Date()) {
      setError(
        "Appointment date and time must be in the future"
      );
      return;
    }

    const selectedDoctor = doctors.find(
      (doctor) => doctor._id === formData.doctor
    );

    if (!selectedDoctor) {
      setError("Please select a valid doctor");
      return;
    }

    if (!selectedDoctor.available) {
      setError(
        "Selected doctor is currently unavailable"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/appointments",
        {
          patient: formData.patient,
          doctor: formData.doctor,
          appointmentDate:
            appointmentDateTime.toISOString(),
          reason: formData.reason.trim(),
        }
      );

      setSuccess(
        response.data.message ||
          "Appointment booked successfully"
      );

      setTimeout(() => {
        navigate("/appointments");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container-fluid py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-2">
          Loading appointment form...
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex align-items-center mb-4">

        <button
          type="button"
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate("/appointments")}
        >
          <FaArrowLeft />
        </button>

        <div>
          <h2 className="mb-1">
            Book Appointment
          </h2>

          <p className="text-muted mb-0">
            Schedule an appointment for a patient
          </p>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row g-4">

              {/* Patient */}
              <div className="col-md-6">

                <label className="form-label">
                  Patient <span className="text-danger">*</span>
                </label>

                <select
                  name="patient"
                  className="form-select"
                  value={formData.patient}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Patient
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient._id}
                      value={patient._id}
                    >
                      {patient.user?.username ||
                        patient.name ||
                        "Unnamed Patient"}
                      {patient.user?.email
                        ? ` - ${patient.user.email}`
                        : ""}
                    </option>
                  ))}
                </select>

                {patients.length === 0 && (
                  <small className="text-danger">
                    No patients available
                  </small>
                )}

              </div>

              {/* Doctor */}
              <div className="col-md-6">

                <label className="form-label">
                  Doctor <span className="text-danger">*</span>
                </label>

                <select
                  name="doctor"
                  className="form-select"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Doctor
                  </option>

                  {doctors.map((doctor) => (
                    <option
                      key={doctor._id}
                      value={doctor._id}
                      disabled={!doctor.available}
                    >
                      Dr.{" "}
                      {doctor.user?.username ||
                        "Unknown Doctor"}{" "}
                      -{" "}
                      {doctor.specialization ||
                        "General"}
                      {!doctor.available
                        ? " (Unavailable)"
                        : ""}
                    </option>
                  ))}
                </select>

                {doctors.length === 0 && (
                  <small className="text-danger">
                    No doctors available
                  </small>
                )}

              </div>

              {/* Date */}
              <div className="col-md-6">

                <label className="form-label">
                  Appointment Date{" "}
                  <span className="text-danger">*</span>
                </label>

                <input
                  type="date"
                  name="appointmentDate"
                  className="form-control"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                />

              </div>

              {/* Time */}
              <div className="col-md-6">

                <label className="form-label">
                  Appointment Time{" "}
                  <span className="text-danger">*</span>
                </label>

                <input
                  type="time"
                  name="appointmentTime"
                  className="form-control"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Reason */}
              <div className="col-12">

                <label className="form-label">
                  Reason for Appointment
                </label>

                <textarea
                  name="reason"
                  className="form-control"
                  rows="4"
                  maxLength="500"
                  placeholder="Enter reason for appointment..."
                  value={formData.reason}
                  onChange={handleChange}
                />

                <small className="text-muted">
                  {formData.reason.length}/500
                </small>

              </div>

              {/* Buttons */}
              <div className="col-12">

                <hr />

                <div className="d-flex justify-content-end gap-2">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate("/appointments")
                    }
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      loading ||
                      patients.length === 0 ||
                      doctors.length === 0
                    }
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Booking...
                      </>
                    ) : (
                      <>
                        <FaCalendarCheck className="me-2" />
                        Book Appointment
                      </>
                    )}
                  </button>

                </div>

              </div>

            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default BookAppointment;

