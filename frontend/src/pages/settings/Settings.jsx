import React, { useState, useEffect } from "react";
import "./Settings.css";
import api from "../../services/api";

const Settings = () => {
  const [hospital, setHospital] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [notifications, setNotifications] = useState({
    appointments: true,
    billing: true,
    email: true,
  });


  const handleHospitalChange = (e) => {
    const { name, value } = e.target;

    setHospital((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;

    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  useEffect(() => {
    fetchAdminSettings();
  }, []);

  const fetchAdminSettings = async () => {
    try {
      const response = await api.get("/admin-settings");
      const data = response.data.data;
      setHospital({
        name: data.hospitalName,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });
    } catch (error) {
      console.error("Error fetching admin settings:", error);
    }
  };

  const handleSaveHospital = async (e) => {
    try {
      e.preventDefault();
      console.log("Hospital settings:", hospital);
      if (!hospital.name.trim() || hospital.email == "" || hospital.phone == "" || hospital.address == "") {
        alert("All fields are required");
      }
      else {
        await api.put("/admin-settings", {
          hospitalName: hospital.name,
          email: hospital.email,
          phone: hospital.phone,
          address: hospital.address,
        });

        alert("Hospital settings saved successfully");
      }

    } catch (error) {
      console.error("Error saving hospital settings:", error);
    }
  };

  return (
    <div className="settings-page">

      <div className="settings-header">
        <div>
          <h1>Admin Settings</h1>
          <p>Manage your MedCore HMS system settings</p>
        </div>
      </div>

      {/* ================= HOSPITAL SETTINGS ================= */}

      <div className="settings-card">

        <div className="settings-card-header">
          <h2>Hospital Information</h2>
          <p>Update your hospital information</p>
        </div>

        <form onSubmit={handleSaveHospital}>

          <div className="settings-grid">

            <div className="form-group">
              <label>Hospital Name</label>

              <input
                type="text"
                name="name"
                value={hospital.name}
                onChange={handleHospitalChange}
                placeholder="Enter hospital name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={hospital.email}
                onChange={handleHospitalChange}
                placeholder="hospital@example.com"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={hospital.phone}
                onChange={handleHospitalChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group full-width">
              <label>Address</label>

              <textarea
                name="address"
                value={hospital.address}
                onChange={handleHospitalChange}
                placeholder="Enter hospital address"
                rows="3"
              />
            </div>

          </div>

          <div className="settings-actions">
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>

        </form>
      </div>


      {/* ================= NOTIFICATION SETTINGS ================= */}

      <div className="settings-card">

        <div className="settings-card-header">
          <h2>Notifications</h2>
          <p>Manage system notifications</p>
        </div>

        <div className="notification-list">

          <label className="notification-item">
            <div>
              <strong>Appointment Notifications</strong>
              <p>Receive notifications about appointments</p>
            </div>

            <input
              type="checkbox"
              name="appointments"
              checked={notifications.appointments}
              onChange={handleNotificationChange}
            />
          </label>


          <label className="notification-item">
            <div>
              <strong>Billing Notifications</strong>
              <p>Receive notifications about billing and payments</p>
            </div>

            <input
              type="checkbox"
              name="billing"
              checked={notifications.billing}
              onChange={handleNotificationChange}
            />
          </label>


          <label className="notification-item">
            <div>
              <strong>Email Notifications</strong>
              <p>Receive important system notifications by email</p>
            </div>

            <input
              type="checkbox"
              name="email"
              checked={notifications.email}
              onChange={handleNotificationChange}
            />
          </label>

        </div>

      </div>


      {/* ================= SYSTEM INFORMATION ================= */}

      <div className="settings-card">

        <div className="settings-card-header">
          <h2>System Information</h2>
          <p>MedCore HMS application information</p>
        </div>

        <div className="system-info">

          <div>
            <span>Application</span>
            <strong>MedCore HMS</strong>
          </div>

          <div>
            <span>Environment</span>
            <strong>Development</strong>
          </div>

          <div>
            <span>Version</span>
            <strong>1.0.0</strong>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;