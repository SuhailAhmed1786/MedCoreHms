import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Doctors = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [availability, setAvailability] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctors");

      setDoctors(response.data.data || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/doctors/${id}`);

      setDoctors((prev) =>
        prev.filter((doctor) => doctor._id !== id)
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete doctor"
      );
    }
  };

  const handleAvailability = async (
    id,
    currentAvailability
  ) => {
    try {
      const response = await api.patch(
        `/doctors/${id}/availability`,
        {
          available: !currentAvailability,
        }
      );

      const updatedAvailability =
        response.data.data.available;

      setDoctors((prev) =>
        prev.map((doctor) =>
          doctor._id === id
            ? {
                ...doctor,
                available: updatedAvailability,
              }
            : doctor
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update availability"
      );
    }
  };

  const specializations = useMemo(() => {
    return [
      ...new Set(
        doctors
          .map((doctor) => doctor.specialization)
          .filter(Boolean)
      ),
    ];
  }, [doctors]);

  const filteredDoctors = doctors.filter((doctor) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      doctor.user?.username
        ?.toLowerCase()
        .includes(searchText) ||
      doctor.user?.email
        ?.toLowerCase()
        .includes(searchText) ||
      doctor.specialization
        ?.toLowerCase()
        .includes(searchText) ||
      doctor.licenseNumber
        ?.toLowerCase()
        .includes(searchText);

    const matchesSpecialization =
      !specialization ||
      doctor.specialization === specialization;

    const matchesAvailability =
      availability === ""
        ? true
        : availability === "available"
        ? doctor.available === true
        : doctor.available === false;

    return (
      matchesSearch &&
      matchesSpecialization &&
      matchesAvailability
    );
  });

  return (
    <div className="container-fluid mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Doctors</h2>
          <p className="text-muted mb-0">
            Manage doctors and their availability
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/staff")}
        >
          + Add Doctor
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">

          <div className="row">

            <div className="col-md-5 mb-3 mb-md-0">
              <label className="form-label">
                Search Doctor
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Name, email, specialization..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="col-md-3 mb-3 mb-md-0">
              <label className="form-label">
                Specialization
              </label>

              <select
                className="form-select"
                value={specialization}
                onChange={(e) =>
                  setSpecialization(e.target.value)
                }
              >
                <option value="">
                  All Specializations
                </option>

                {specializations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-3 mb-md-0">
              <label className="form-label">
                Availability
              </label>

              <select
                className="form-select"
                value={availability}
                onChange={(e) =>
                  setAvailability(e.target.value)
                }
              >
                <option value="">
                  All
                </option>

                <option value="available">
                  Available
                </option>

                <option value="unavailable">
                  Unavailable
                </option>
              </select>
            </div>

            <div className="col-md-1 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setSpecialization("");
                  setAvailability("");
                }}
              >
                Clear
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Doctor table */}
      <div className="card shadow-sm">

        <div className="card-body">

          <div className="d-flex justify-content-between mb-3">
            <h5 className="mb-0">
              Doctor List
            </h5>

            <span className="text-muted">
              {filteredDoctors.length} doctor(s)
            </span>
          </div>

          {loading ? (
            <p>Loading doctors...</p>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-5">
              <h5>No doctors found</h5>
              <p className="text-muted">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Qualification</th>
                    <th>License</th>
                    <th>Fee</th>
                    <th>Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredDoctors.map((doctor) => (

                    <tr key={doctor._id}>

                      <td>
                        <strong>
                          Dr.{" "}
                          {doctor.user?.username ||
                            "-"}
                        </strong>

                        <br />

                        <small className="text-muted">
                          {doctor.user?.email || "-"}
                        </small>
                      </td>

                      <td>
                        {doctor.specialization ||
                          "-"}
                      </td>

                      <td>
                        {doctor.qualification ||
                          "-"}
                      </td>

                      <td>
                        {doctor.licenseNumber ||
                          "-"}
                      </td>

                      <td>
                        {doctor.consultationFee
                          ? `₹${doctor.consultationFee}`
                          : "-"}
                      </td>

                      <td>
                        <button
                          className={`btn btn-sm ${
                            doctor.available
                              ? "btn-success"
                              : "btn-secondary"
                          }`}
                          onClick={() =>
                            handleAvailability(
                              doctor._id,
                              doctor.available
                            )
                          }
                        >
                          {doctor.available
                            ? "Available"
                            : "Unavailable"}
                        </button>
                      </td>

                      <td>
                        <div className="d-flex gap-1">

                          <button
                            className="btn btn-sm btn-info"
                            onClick={() =>
                              navigate(
                                `/doctors/${doctor._id}`
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              navigate(
                                `/doctors/${doctor._id}/edit`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleDelete(
                                doctor._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Doctors;