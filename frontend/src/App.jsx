import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from './pages/Dashboard'

import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatient";

// const Dashboard = () => {
//   return (
//     <div className="container mt-5">
//       <h1>MedCore HMS Dashboard</h1>
//     </div>
//   );
// };

function App() {
  return (
    <BrowserRouter>

  <Routes>

    <Route
      path="/"
      element={<Navigate to="/login" />}
    />

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    <Route
      path="/verify-email/:token"
      element={<VerifyEmail />}
    />

    <Route
      path="/dashboard"
      element={<Dashboard />}
    />

    <Route
      path="/patients"
      element={<Patients />}
    />

    <Route
      path="/patients/add"
      element={<AddPatient />}
    />

  </Routes>

</BrowserRouter>
  );
}

export default App;