import {
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";

import Login from "./pages/Login";

import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";

import MemberDashboard from "./pages/MemberDashboard";

import ProjectDetails from "./pages/ProjectDetails";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<HomePage />}
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
        path="/admin"
        element={
          <ProtectedRoute
            allowedRole="admin"
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/project/:id"
        element={
          <ProtectedRoute
            allowedRole="admin"
          >
            <ProjectDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/member"
        element={
          <ProtectedRoute
            allowedRole="member"
          >
            <MemberDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;