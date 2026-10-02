import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./css/EditBilling.css";

const EditBilling = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [billing, setBilling] = useState(null);
  const [items, setItems] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------
  // Get billing
  // --------------------------------

  const getBilling = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/billing/${id}`);

      if (response.data.success) {
        const data = response.data.data;

        setBilling(data);
        setItems(data.items || []);
        setDiscount(data.discount || 0);
        setTax(data.tax || 0);
        setPaymentMethod(data.paymentMethod || "");
        setNotes(data.notes || "");
      }
    } catch (error) {
      console.error("Get Billing Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load billing"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBilling();
  }, [id]);

  // --------------------------------
  // Item change
  // --------------------------------

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "quantity" ||
                field === "amount"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  // --------------------------------
  // Add item
  // --------------------------------

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        description: "",
        quantity: 1,
        amount: 0,
      },
    ]);
  };

  // --------------------------------
  // Remove item
  // --------------------------------

  const removeItem = (index) => {
    if (items.length === 1) {
      setError(
        "At least one billing item is required"
      );
      return;
    }

    setItems((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // --------------------------------
  // Calculations
  // --------------------------------

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 0) *
        Number(item.amount || 0),
    0
  );

  const totalAmount = Math.max(
    0,
    subtotal -
      Number(discount || 0) +
      Number(tax || 0)
  );

  // --------------------------------
  // Update billing
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!items.length) {
      setError(
        "At least one billing item is required"
      );
      return;
    }

    const invalidItem = items.some(
      (item) =>
        !item.description?.trim() ||
        Number(item.quantity) <= 0 ||
        Number(item.amount) < 0
    );

    if (invalidItem) {
      setError(
        "Please enter valid billing item details"
      );
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(
        `/billing/${id}`,
        {
          items,
          discount: Number(discount),
          tax: Number(tax),
          paymentMethod:
            paymentMethod || undefined,
          notes,
        }
      );

      if (response.data.success) {
        alert("Billing updated successfully");

        navigate(`/billing/${id}`);
      }
    } catch (error) {
      console.error("Update Billing Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update billing"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <p>Loading billing...</p>
      </div>
    );
  }

  if (!billing) {
    return (
      <div>
        <p>
          {error || "Billing record not found"}
        </p>

        <button
          onClick={() => navigate("/billing")}
        >
          Back
        </button>
      </div>
    );
  }

  // Don't allow editing cancelled bills

  if (billing.paymentStatus === "CANCELLED") {
    return (
      <div>
        <h2>Billing Cancelled</h2>

        <p>
          A cancelled billing record cannot be
          edited.
        </p>

        <button
          onClick={() =>
            navigate(`/billing/${id}`)
          }
        >
          Back to Billing Details
        </button>
      </div>
    );
  }

  return (
    <div className="edit-billing-page">

      {/* Header */}

      <div className="page-header">

        <div>
          <h1>Edit Billing</h1>

          <p>
            Invoice ID: <strong>{billing._id}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(`/billing/${id}`)
          }
        >
          Back
        </button>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Patient / Doctor */}

      <div className="details-card">

        <h2>Billing Information</h2>

        <p>
          <strong>Patient:</strong>{" "}
          {billing.patient?.user?.name ||
            billing.patient?.user?.username ||
            "N/A"}
        </p>

        <p>
          <strong>Doctor:</strong>{" "}
          {billing.doctor?.user?.name ||
            billing.doctor?.user?.username ||
            "N/A"}
        </p>

        <p>
          <strong>Appointment:</strong>{" "}
          {billing.appointment?.reason ||
            "N/A"}
        </p>

      </div>

      <form onSubmit={handleSubmit}>

        {/* Items */}

        <div className="details-card">

          <div className="section-header">

            <h2>Billing Items</h2>

            <button
              type="button"
              onClick={addItem}
            >
              + Add Item
            </button>

          </div>

          {items.map((item, index) => (
            <div
              className="billing-item"
              key={index}
            >

              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "description",
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "quantity",
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                min="0"
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "amount",
                    e.target.value
                  )
                }
              />

              <strong>
                ₹
                {(
                  Number(item.quantity || 0) *
                  Number(item.amount || 0)
                ).toFixed(2)}
              </strong>

              <button
                type="button"
                onClick={() =>
                  removeItem(index)
                }
              >
                Remove
              </button>

            </div>
          ))}

        </div>

        {/* Amount */}

        <div className="details-card">

          <h2>Amount</h2>

          <div className="amount-row">

            <span>Subtotal</span>

            <strong>
              ₹{subtotal.toFixed(2)}
            </strong>

          </div>

          <div className="form-group">

            <label>Discount</label>

            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) =>
                setDiscount(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Tax</label>

            <input
              type="number"
              min="0"
              value={tax}
              onChange={(e) =>
                setTax(e.target.value)
              }
            />

          </div>

          <div className="amount-row total">

            <span>Total Amount</span>

            <strong>
              ₹{totalAmount.toFixed(2)}
            </strong>

          </div>

        </div>

        {/* Payment */}

        <div className="details-card">

          <h2>Payment Information</h2>

          <p>
            <strong>Already Paid:</strong>{" "}
            ₹{Number(billing.paidAmount).toFixed(2)}
          </p>

          <p>
            <strong>Remaining:</strong>{" "}
            ₹
            {Math.max(
              0,
              totalAmount -
                Number(billing.paidAmount || 0)
            ).toFixed(2)}
          </p>

          <div className="form-group">

            <label>Payment Method</label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            >
              <option value="">
                Select Payment Method
              </option>

              <option value="CASH">
                Cash
              </option>

              <option value="CARD">
                Card
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="ONLINE">
                Online
              </option>
            </select>

          </div>

          <div className="form-group">

            <label>Notes</label>

            <textarea
              rows="4"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />

          </div>

        </div>

        {/* Actions */}

        <div className="form-actions">

          <button
            type="button"
            onClick={() =>
              navigate(`/billing/${id}`)
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Billing"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditBilling; 