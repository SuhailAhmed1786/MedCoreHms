import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaUserInjured,
} from "react-icons/fa";
import api from "../services/api";

const AddPatient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.dateOfBirth) {
      setError("Date of birth is required");
      return;
    }

    if (!formData.gender) {
      setError("Please select gender");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/patients",
        {
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          bloodGroup: formData.bloodGroup || undefined,

          emergencyContact: {
            name:
              formData.emergencyContactName.trim(),
            phone:
              formData.emergencyContactPhone.trim(),
            relationship:
              formData.emergencyContactRelationship.trim(),
          },
        }
      );

      console.log(
        "Create patient response:",
        response.data
      );

      setSuccess(
        response.data?.message ||
          "Patient created successfully"
      );

      // Redirect after short delay
      setTimeout(() => {
        navigate("/patients");
      }, 1000);

    } catch (error) {
      console.error(
        "Create patient error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to create patient"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-patient-page">

      {/* Header */}
      <div className="add-patient-header">

        <div>

          <button
            className="back-btn"
            onClick={() =>
              navigate("/patients")
            }
          >
            <FaArrowLeft />
            Back to Patients
          </button>

          <h2>
            <FaUserInjured />
            Add Patient
          </h2>

          <p>
            Create a new patient profile
          </p>

        </div>

      </div>

      {/* Form */}
      <div className="patient-form-card">

        <form onSubmit={handleSubmit}>

          {/* Personal Information */}
          <div className="form-section">

            <div className="section-title">

              <h4>
                Personal Information
              </h4>

              <p>
                Enter patient's basic information
              </p>

            </div>

            <div className="row">

              {/* Date of Birth */}
              <div className="col-md-6 mb-3">

                <label>
                  Date of Birth{" "}
                  <span>*</span>
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    formData.dateOfBirth
                  }
                  onChange={handleChange}
                  className="form-control"
                  max={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                />

              </div>

              {/* Gender */}
              <div className="col-md-6 mb-3">

                <label>
                  Gender{" "}
                  <span>*</span>
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="MALE">
                    Male
                  </option>

                  <option value="FEMALE">
                    Female
                  </option>

                  <option value="OTHER">
                    Other
                  </option>

                </select>

              </div>

              {/* Phone */}
              <div className="col-md-6 mb-3">

                <label>
                  Phone Number{" "}
                  <span>*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter phone number"
                />

              </div>

              {/* Blood Group */}
              <div className="col-md-6 mb-3">

                <label>
                  Blood Group
                </label>

                <select
                  name="bloodGroup"
                  value={
                    formData.bloodGroup
                  }
                  onChange={handleChange}
                  className="form-select"
                >

                  <option value="">
                    Select Blood Group
                  </option>

                  <option value="A+">
                    A+
                  </option>

                  <option value="A-">
                    A-
                  </option>

                  <option value="B+">
                    B+
                  </option>

                  <option value="B-">
                    B-
                  </option>

                  <option value="AB+">
                    AB+
                  </option>

                  <option value="AB-">
                    AB-
                  </option>

                  <option value="O+">
                    O+
                  </option>

                  <option value="O-">
                    O-
                  </option>

                </select>

              </div>

              {/* Address */}
              <div className="col-12 mb-3">

                <label>
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Enter patient address"
                />

              </div>

            </div>

          </div>

          {/* Emergency Contact */}
          <div className="form-section">

            <div className="section-title">

              <h4>
                Emergency Contact
              </h4>

              <p>
                Person to contact in case of emergency
              </p>

            </div>

            <div className="row">

              {/* Name */}
              <div className="col-md-4 mb-3">

                <label>
                  Contact Name
                </label>

                <input
                  type="text"
                  name="emergencyContactName"
                  value={
                    formData.emergencyContactName
                  }
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Contact name"
                />

              </div>

              {/* Phone */}
              <div className="col-md-4 mb-3">

                <label>
                  Contact Phone
                </label>

                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={
                    formData.emergencyContactPhone
                  }
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Contact phone"
                />

              </div>

              {/* Relationship */}
              <div className="col-md-4 mb-3">

                <label>
                  Relationship
                </label>

                <input
                  type="text"
                  name="emergencyContactRelationship"
                  value={
                    formData.emergencyContactRelationship
                  }
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. Father, Mother"
                />

              </div>

            </div>

          </div>

          {/* Messages */}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/patients")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-patient-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Patient
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddPatient;