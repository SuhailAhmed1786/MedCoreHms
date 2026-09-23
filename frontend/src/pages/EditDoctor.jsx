import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    specialization: "",
    qualification: "",
    licenseNumber: "",
    phone: "",
    consultationFee: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await api.get(
        `/doctors/${id}`
      );

      const doctor = response.data.data;

      setFormData({
        specialization:
          doctor.specialization || "",

        qualification:
          doctor.qualification || "",

        licenseNumber:
          doctor.licenseNumber || "",

        phone: doctor.phone || "",

        consultationFee:
          doctor.consultationFee ?? "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load doctor"
      );
    } finally {
      setLoading(false);
    }
  };

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
    setSuccess("");

    try {
      const response = await api.put(
        `/doctors/${id}`,
        {
          ...formData,
          consultationFee:
            formData.consultationFee === ""
              ? undefined
              : Number(
                  formData.consultationFee
                ),
        }
      );

      setSuccess(
        response.data.message ||
          "Doctor updated successfully"
      );

      setTimeout(() => {
        navigate(`/doctors/${id}`);
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update doctor"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading doctor...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2>Edit Doctor</h2>

          <p className="text-muted mb-0">
            Update doctor information
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate(`/doctors/${id}`)
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

            <h5 className="mb-4">
              Professional Information
            </h5>

            <div className="row">

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Specialization
                </label>

                <input
                  type="text"
                  name="specialization"
                  className="form-control"
                  value={
                    formData.specialization
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Qualification
                </label>

                <input
                  type="text"
                  name="qualification"
                  className="form-control"
                  value={
                    formData.qualification
                  }
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  License Number
                </label>

                <input
                  type="text"
                  name="licenseNumber"
                  className="form-control"
                  value={
                    formData.licenseNumber
                  }
                  onChange={handleChange}
                  required
                />

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
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Consultation Fee
                </label>

                <input
                  type="number"
                  name="consultationFee"
                  className="form-control"
                  min="0"
                  value={
                    formData.consultationFee
                  }
                  onChange={handleChange}
                />

              </div>

            </div>

            <hr />

            <div className="d-flex gap-2">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Updating..."
                  : "Update Doctor"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate(`/doctors/${id}`)
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

export default EditDoctor;