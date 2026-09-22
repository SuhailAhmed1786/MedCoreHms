import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/verify-email/:token"
          element={<VerifyEmail />}
        />

        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Patient routes */}
          <Route
            path="/patients"
            element={<Patients />}
          />

          <Route
            path="/patients/add"
            element={<AddPatient />}
          />

          {/* Admin-only routes */}
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>

            <Route
              path="/doctors"
              element={<div>Manage Doctors</div>}
            />

            <Route
              path="/settings"
              element={<div>Admin Settings</div>}
            />

          </Route>

          {/* Admin + Receptionist */}
          <Route
            element={
              <RoleRoute
                allowedRoles={["ADMIN", "RECEPTIONIST"]}
              />
            }
          >
            <Route
              path="/billing"
              element={<div>Billing</div>}
            />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;