import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";

import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";
import PatientDetails from "./pages/PatientDetails";
import EditPatient from "./pages/EditPatient";

import StaffManagement from "./pages/StaffManagement";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import EditDoctor from "./pages/EditDoctor";

import Appointments from "./pages/appointments/Appointments";
import BookAppointment from "./pages/appointments/BookAppointment";
import AppointmentDetails from "./pages/appointments/AppointmentDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import PublicRoute from "./components/PublicRoute";

import EMRList from "./pages/emr/EMRList";
import AddEMR from "./pages/emr/AddEMR";
import EMRDetails from "./pages/emr/EMRDetails";
import EditEMR from "./pages/emr/EditEMR";
import Billing from "./pages/billing/Billing";
import AddBilling from './pages/billing/AddBilling';
import BillingDetails from "./pages/billing/BillingDetails";
import EditBilling from "./pages/billing/EditBilling";

import Settings from "./pages/settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/verify-email/:token"
            element={<VerifyEmail />}
          />
        </Route>


        {/* =====================================================
            ALL PROTECTED ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          {/* ================= DASHBOARD ================= */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* ================= PATIENTS ================= */}

          <Route
            path="/patients"
            element={<Patients />}
          />

          <Route
            path="/patients/add"
            element={<AddPatient />}
          />

          <Route
            path="/patients/:id"
            element={<PatientDetails />}
          />

          <Route
            path="/patients/:id/edit"
            element={<EditPatient />}
          />


          {/* ================= STAFF ================= */}

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>

            <Route
              path="/staff"
              element={<StaffManagement />}
            />

          </Route>


          {/* ================= EMR ================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={["ADMIN", "DOCTOR"]}
              />
            }
          >

            <Route
              path="/emr"
              element={<EMRList />}
            />

            <Route
              path="/emr/add"
              element={<AddEMR />}
            />

            <Route
              path="/emr/:id"
              element={<EMRDetails />}
            />

            <Route
              path="/emr/:id/edit"
              element={<EditEMR />}
            />

          </Route>


          {/* ================= APPOINTMENTS ================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "DOCTOR",
                  "RECEPTIONIST",
                ]}
              />
            }
          >

            <Route
              path="/appointments"
              element={<Appointments />}
            />

            <Route
              path="/appointments/add"
              element={<BookAppointment />}
            />

            <Route
              path="/appointments/:id"
              element={<AppointmentDetails />}
            />

          </Route>


          {/* ================= DOCTORS ================= */}

          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN"]} />
            }
          >

            <Route
              path="/doctors"
              element={<Doctors />}
            />

            <Route
              path="/doctors/:id"
              element={<DoctorDetails />}
            />

            <Route
              path="/doctors/:id/edit"
              element={<EditDoctor />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>


          {/* ================= BILLING ================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={["ADMIN", "RECEPTIONIST"]}
              />
            }
          >

            <Route
              path="/billing"
              element={<Billing />}
            />

            <Route
              path="/billing/add"
              element={<AddBilling />}
            />

            <Route
              path="/billing/:id"
              element={<BillingDetails />}
            />

            <Route
              path="/billing/:id/edit"
              element={<EditBilling />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

