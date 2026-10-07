import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUserMd,
  FaArrowLeft,
} from "react-icons/fa";
import api from "../../services/api";


const Appointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user.role;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments");

      setAppointments(response.data.data || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (appointment) => {
    return (
      appointment.patient?.user?.username ||
      appointment.patient?.name ||
      "N/A"
    );
  };

  const getDoctorName = (appointment) => {
    return (
      appointment.doctor?.user?.username ||
      "N/A"
    );
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patientName =
        getPatientName(appointment).toLowerCase();

      const doctorName =
        getDoctorName(appointment).toLowerCase();

      const searchText = search.toLowerCase();

      const matchesSearch =
        patientName.includes(searchText) ||
        doctorName.includes(searchText);

      const matchesStatus =
        !status || appointment.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, status]);

  const handleStatus = async (id, newStatus) => {
    try {
      const response = await api.patch(
        `/appointments/${id}/status`,
        {
          status: newStatus,
        }
      );

      const updatedAppointment =
        response.data.data;

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id
            ? updatedAppointment
            : appointment
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update appointment status"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/appointments/${id}`);

      setAppointments((prev) =>
        prev.filter(
          (appointment) => appointment._id !== id
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete appointment"
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <button
          type="button"
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Appointments</h2>
          <p className="text-muted mb-0">
            Manage patient appointments
          </p>
        </div>
        
        

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/appointments/add")
          }
        >
          <FaPlus className="me-2" />
          Book Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">
                Search
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search patient or doctor..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Status
              </label>

              <select
                className="form-select"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="">
                  All Status
                </option>

                <option value="SCHEDULED">
                  Scheduled
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

                <option value="NO_SHOW">
                  No Show
                </option>
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                }}
              >
                Clear
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          />
          <p className="mt-2">
            Loading appointments...
          </p>
        </div>
      ) : (
        <div className="card shadow-sm">

          <div className="card-body p-0">

            <div className="table-responsive">
              <table className="table table-hover mb-0">

                <thead className="table-light">
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-5"
                      >
                        No appointments found
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map(
                      (appointment) => (
                        <tr key={appointment._id}>

                          <td>
                            <strong>
                              {getPatientName(
                                appointment
                              )}
                            </strong>

                            {appointment.patient
                              ?.user?.email && (
                              <div className="small text-muted">
                                {
                                  appointment.patient
                                    .user.email
                                }
                              </div>
                            )}
                          </td>

                          <td>
                            <FaUserMd className="me-2" />

                            {getDoctorName(
                              appointment
                            )}
                          </td>

                          <td>
                            {formatDate(
                              appointment.appointmentDate
                            )}
                          </td>

                          <td>
                            {appointment.reason ||
                              "N/A"}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                appointment.status ===
                                "SCHEDULED"
                                  ? "bg-primary"
                                  : appointment.status ===
                                    "COMPLETED"
                                  ? "bg-success"
                                  : appointment.status ===
                                    "CANCELLED"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </td>

                          <td>
                            <div className="d-flex gap-2">

                              {/* View */}
                              <button
                                className="btn btn-sm btn-outline-primary"
                                title="View"
                                onClick={() =>
                                  navigate(
                                    `/appointments/${appointment._id}`
                                  )
                                }
                              >
                                <FaEye />
                              </button>

                              {/* Edit */}
                              {appointment.status ===
                                "SCHEDULED" && (
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Edit"
                                  onClick={() =>
                                    navigate(
                                      `/appointments/edit/${appointment._id}`
                                    )
                                  }
                                >
                                  <FaEdit />
                                </button>
                              )}

                              {/* Complete */}
                              {appointment.status ===
                                "SCHEDULED" && (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  title="Complete"
                                  onClick={() =>
                                    handleStatus(
                                      appointment._id,
                                      "COMPLETED"
                                    )
                                  }
                                >
                                  <FaCheck />
                                </button>
                              )}

                              {/* Cancel */}
                              {appointment.status ===
                                "SCHEDULED" && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  title="Cancel"
                                  onClick={() =>
                                    handleStatus(
                                      appointment._id,
                                      "CANCELLED"
                                    )
                                  }
                                >
                                  <FaTimes />
                                </button>
                              )}

                              {/* Delete - Admin only */}
                              {role === "ADMIN" && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  title="Delete"
                                  onClick={() =>
                                    handleDelete(
                                      appointment._id
                                    )
                                  }
                                >
                                  <FaTrash />
                                </button>
                              )}

                            </div>
                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* Count */}
      {!loading && (
        <div className="mt-3 text-muted">
          Showing {filteredAppointments.length} of{" "}
          {appointments.length} appointments
        </div>
      )}

    </div>
  );
};

export default Appointments;