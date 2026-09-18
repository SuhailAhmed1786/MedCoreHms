import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaUserInjured,
  FaSyncAlt,
} from "react-icons/fa";
import api from "../services/api";

const Patients = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [error, setError] = useState("");

  // Get patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/patients");

      console.log("Patients API response:", response.data);

      const patientData = response.data?.data || [];

      setPatients(patientData);
      setFilteredPatients(patientData);
    } catch (error) {
      console.error("Fetch patients error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load patients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Search
  useEffect(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter((patient) => {
      const username =
        patient.user?.username ||
        patient.username ||
        "";

      const email =
        patient.user?.email ||
        patient.email ||
        "";

      const phone = patient.phone || "";

      return (
        username.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        phone.toLowerCase().includes(searchText)
      );
    });

    setFilteredPatients(filtered);
  }, [search, patients]);

  // Delete patient
  const handleDelete = async (patientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleteLoading(patientId);

      await api.delete(`/patients/${patientId}`);

      setPatients((prevPatients) =>
        prevPatients.filter(
          (patient) => patient._id !== patientId
        )
      );

      alert("Patient deleted successfully");
    } catch (error) {
      console.error("Delete patient error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete patient"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return "-";
    }

    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age =
      today.getFullYear() -
      dob.getFullYear();

    const monthDifference =
      today.getMonth() -
      dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="patients-page">

      {/* Header */}
      <div className="patients-header">

        <div>
          <h2>
            <FaUserInjured /> Patients
          </h2>

          <p>
            Manage hospital patients and their information
          </p>
        </div>

        <div className="header-actions">

          <button
            className="refresh-btn"
            onClick={fetchPatients}
            disabled={loading}
          >
            <FaSyncAlt />
            Refresh
          </button>

          <button
            className="add-patient-btn"
            onClick={() => navigate("/patients/add")}
          >
            <FaPlus />
            Add Patient
          </button>

        </div>

      </div>

      {/* Search */}
      <div className="patient-toolbar">

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search patient by name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="patient-count">
          Total Patients:{" "}
          <strong>{filteredPatients.length}</strong>
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
        <div className="loading-container">
          <div className="spinner-border text-primary" />
          <p>Loading patients...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="empty-patients">

          <FaUserInjured size={50} />

          <h4>No patients found</h4>

          <p>
            {search
              ? "Try a different search."
              : "Add your first patient to get started."}
          </p>

          {!search && (
            <button
              className="add-patient-btn"
              onClick={() =>
                navigate("/patients/add")
              }
            >
              <FaPlus />
              Add Patient
            </button>
          )}

        </div>
      ) : (

        /* Patient Table */
        <div className="patient-table-card">

          <div className="table-responsive">

            <table className="table patient-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Blood Group</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredPatients.map(
                  (patient, index) => {

                    const username =
                      patient.user?.username ||
                      patient.username ||
                      "Unknown";

                    const email =
                      patient.user?.email ||
                      patient.email ||
                      "-";

                    return (
                      <tr key={patient._id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <div className="patient-name">

                            <div className="patient-avatar">
                              {username
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {username}
                              </strong>

                              <small>
                                ID:{" "}
                                {patient._id
                                  ?.slice(-6)
                                  .toUpperCase()}
                              </small>
                            </div>

                          </div>
                        </td>

                        <td>
                          {email}
                        </td>

                        <td>
                          {patient.phone || "-"}
                        </td>

                        <td>
                          {patient.gender || "-"}
                        </td>

                        <td>
                          {calculateAge(
                            patient.dateOfBirth
                          )}
                        </td>

                        <td>
                          {patient.bloodGroup ? (
                            <span className="blood-badge">
                              {patient.bloodGroup}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>

                          <div className="action-buttons">

                            <button
                              className="action-view"
                              title="View patient"
                              onClick={() =>
                                navigate(
                                  `/patients/${patient._id}`
                                )
                              }
                            >
                              <FaEye />
                            </button>

                            <button
                              className="action-edit"
                              title="Edit patient"
                              onClick={() =>
                                navigate(
                                  `/patients/${patient._id}/edit`
                                )
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="action-delete"
                              title="Delete patient"
                              disabled={
                                deleteLoading ===
                                patient._id
                              }
                              onClick={() =>
                                handleDelete(
                                  patient._id
                                )
                              }
                            >
                              {deleteLoading ===
                              patient._id ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                <FaTrash />
                              )}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default Patients;