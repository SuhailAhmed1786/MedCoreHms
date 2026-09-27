
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUser,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import api from "../../services/api";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const role = user.role;

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/appointments/${id}`
      );

      setAppointment(response.data.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (newStatus) => {
    try {
      const response = await api.patch(
        `/appointments/${id}/status`,
        {
          status: newStatus,
        }
      );

      setAppointment(response.data.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update appointment status"
      );
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/appointments/${id}`);

      navigate("/appointments");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete appointment"
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-primary";

      case "COMPLETED":
        return "bg-success";

      case "CANCELLED":
        return "bg-danger";

      case "NO_SHOW":
        return "bg-warning text-dark";

      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-2">
          Loading appointment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">

        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() =>
            navigate("/appointments")
          }
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>

        <div className="alert alert-danger">
          {error}
        </div>

      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container-fluid py-4">

        <div className="alert alert-warning">
          Appointment not found
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/appointments")
          }
        >
          Back to Appointments
        </button>

      </div>
    );
  }

  const patient =
    appointment.patient?.user;

  const doctor =
    appointment.doctor?.user;

  const isScheduled =
    appointment.status === "SCHEDULED";

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div className="d-flex align-items-center">

          <button
            className="btn btn-outline-secondary me-3"
            onClick={() =>
              navigate("/appointments")
            }
          >
            <FaArrowLeft />
          </button>

          <div>
            <h2 className="mb-1">
              Appointment Details
            </h2>

            <p className="text-muted mb-0">
              View appointment information
            </p>
          </div>

        </div>

        {/* Actions */}
        <div className="d-flex gap-2">

          {isScheduled && (
            <button
              className="btn btn-outline-primary"
              onClick={() =>
                navigate(
                  `/appointments/${id}/edit`
                )
              }
            >
              <FaEdit className="me-2" />
              Edit
            </button>
          )}

          {role === "ADMIN" && (
            <button
              className="btn btn-outline-danger"
              onClick={handleDelete}
            >
              <FaTrash className="me-2" />
              Delete
            </button>
          )}

        </div>

      </div>

      {/* Status Card */}
      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="row align-items-center">

            <div className="col-md-8">

              <h5 className="mb-2">
                Appointment Status
              </h5>

              <span
                className={`badge ${getStatusClass(
                  appointment.status
                )} fs-6`}
              >
                {appointment.status}
              </span>

            </div>

            {isScheduled && (
              <div className="col-md-4 text-md-end mt-3 mt-md-0">

                <div className="d-flex justify-content-md-end gap-2 flex-wrap">

                  <button
                    className="btn btn-success"
                    onClick={() =>
                      handleStatus("COMPLETED")
                    }
                  >
                    <FaCheck className="me-2" />
                    Complete
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleStatus("CANCELLED")
                    }
                  >
                    <FaTimes className="me-2" />
                    Cancel
                  </button>

                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      handleStatus("NO_SHOW")
                    }
                  >
                    No Show
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      <div className="row g-4">

        {/* Patient */}
        <div className="col-md-6">

          <div className="card shadow-sm h-100">

            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Patient Information
              </h5>
            </div>

            <div className="card-body">

              <div className="mb-3">
                <label className="text-muted">
                  Name
                </label>

                <div className="fw-semibold">
                  {patient?.username ||
                    "N/A"}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-muted">
                  Email
                </label>

                <div>
                  {patient?.email ||
                    "N/A"}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-muted">
                  Phone
                </label>

                <div>
                  {appointment.patient
                    ?.phone || "N/A"}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Doctor */}
        <div className="col-md-6">

          <div className="card shadow-sm h-100">

            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaUserMd className="me-2" />
                Doctor Information
              </h5>
            </div>

            <div className="card-body">

              <div className="mb-3">
                <label className="text-muted">
                  Doctor
                </label>

                <div className="fw-semibold">
                  Dr.{" "}
                  {doctor?.username ||
                    "N/A"}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-muted">
                  Email
                </label>

                <div>
                  {doctor?.email ||
                    "N/A"}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-muted">
                  Specialization
                </label>

                <div>
                  {appointment.doctor
                    ?.specialization ||
                    "N/A"}
                </div>
              </div>

              <div className="mb-0">
                <label className="text-muted">
                  Consultation Fee
                </label>

                <div>
                  ₹
                  {appointment.doctor
                    ?.consultationFee ??
                    "N/A"}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Appointment Information */}
        <div className="col-12">

          <div className="card shadow-sm">

            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Appointment Information
              </h5>
            </div>

            <div className="card-body">

              <div className="row">

                <div className="col-md-4 mb-4">
                  <label className="text-muted">
                    Appointment Date
                  </label>

                  <div className="fw-semibold">
                    {formatDate(
                      appointment.appointmentDate
                    )}
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label className="text-muted">
                    Appointment Time
                  </label>

                  <div className="fw-semibold">
                    <FaClock className="me-2" />
                    {formatTime(
                      appointment.appointmentDate
                    )}
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <label className="text-muted">
                    Status
                  </label>

                  <div>
                    <span
                      className={`badge ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>

                <div className="col-12">

                  <label className="text-muted">
                    Reason
                  </label>

                  <div className="mt-1">
                    {appointment.reason ||
                      "No reason provided"}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AppointmentDetails;