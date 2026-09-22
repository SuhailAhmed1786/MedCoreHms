import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/patients/${id}`);

        const patient = response.data.data;

        setFormData({
          dateOfBirth: patient.dateOfBirth
            ? patient.dateOfBirth.split("T")[0]
            : "",
          gender: patient.gender || "",
          phone: patient.phone || "",
          address: patient.address || "",
          bloodGroup: patient.bloodGroup || "",
          emergencyContact: {
            name:
              patient.emergencyContact?.name || "",
            phone:
              patient.emergencyContact?.phone || "",
            relationship:
              patient.emergencyContact?.relationship ||
              "",
          },
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load patient"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEmergencyChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      emergencyContact: {
        ...formData.emergencyContact,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put(
        `/patients/${id}`,
        formData
      );

      setSuccess(
        response.data.message ||
          "Patient updated successfully"
      );

      setTimeout(() => {
        navigate(`/patients/${id}`);
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update patient"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading patient...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Edit Patient</h2>
          <p className="text-muted">
            Update patient information
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate(`/patients/${id}`)
          }
        >
          Back
        </button>
      </div>

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

      <div className="card shadow-sm">
        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <h5 className="mb-3">
              Patient Information
            </h5>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-control"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Gender
                </label>

                <select
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
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

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Blood Group
                </label>

                <select
                  name="bloodGroup"
                  className="form-select"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Blood Group
                  </option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Address
                </label>

                <textarea
                  name="address"
                  className="form-control"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>

            </div>

            <hr />

            <h5 className="mb-3">
              Emergency Contact
            </h5>

            <div className="row">

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={
                    formData.emergencyContact.name
                  }
                  onChange={handleEmergencyChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={
                    formData.emergencyContact.phone
                  }
                  onChange={handleEmergencyChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Relationship
                </label>

                <input
                  type="text"
                  name="relationship"
                  className="form-control"
                  value={
                    formData.emergencyContact.relationship
                  }
                  onChange={handleEmergencyChange}
                />
              </div>

            </div>

            <div className="mt-3">
              <button
                type="submit"
                className="btn btn-primary me-2"
                disabled={saving}
              >
                {saving
                  ? "Updating..."
                  : "Update Patient"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate(`/patients/${id}`)
                }
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default EditPatient;