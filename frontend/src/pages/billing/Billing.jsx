import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./css/Billing.css";

const Billing = () => {
  const navigate = useNavigate();
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const API_URL = "http://localhost:5000/api";

  const getBillings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${api.defaults.baseURL}/billing`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBillings(response.data.data);
      }
    } catch (error) {
      console.error("Get Billing Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch billing records"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBillings();
  }, []);

  const getPatientName = (billing) => {
    return (
      billing?.patient?.user?.name ||
      billing?.patient?.user?.username ||
      "N/A"
    );
  };

  const getDoctorName = (billing) => {
    return (
      billing?.doctor?.user?.name ||
      billing?.doctor?.user?.username ||
      "N/A"
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return <div>Loading billing records...</div>;
  }

  return (
    <div className="billing-page">
      <div className="billing-header">
        <div>
          <h1>Billing</h1>
          <p>Manage patient invoices and payments</p>
        </div>

        <button
          onClick={() => navigate("/billing/add")}
        >
          + Create Bill
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {billings.length === 0 ? (
        <div className="empty-state">
          <h3>No billing records found</h3>
          <p>Create a bill for a completed appointment.</p>
        </div>
      ) : (
        <div className="billing-table-container">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Appointment Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {billings.map((billing) => {
                const remaining =
                  Number(billing.totalAmount || 0) -
                  Number(billing.paidAmount || 0);

                return (
                  <tr key={billing._id}>
                    <td>
                      {getPatientName(billing)}
                    </td>

                    <td>
                      {getDoctorName(billing)}
                    </td>

                    <td>
                      {formatDate(
                        billing.appointment?.appointmentDate
                      )}
                    </td>

                    <td>
                      ₹{billing.totalAmount}
                    </td>

                    <td>
                      ₹{billing.paidAmount}
                    </td>

                    <td>
                      ₹{remaining}
                    </td>

                    <td>
                      <span
                        className={`status ${billing.paymentStatus?.toLowerCase()}`}
                      >
                        {billing.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          navigate(
                            `/billing/${billing._id}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Billing;