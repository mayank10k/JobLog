import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Reminders from "./pages/Reminders";

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const AppRoutes=()=> {
  return (
    <Routes>
      <Route path="/"             element={<Navigate to="/dashboard" />} />
      <Route path="/login"        element={<Login />} />
      <Route path="/register"     element={<Register />} />
      <Route path="/dashboard"    element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/applications" element={<ProtectedLayout><Applications /></ProtectedLayout>} />
      <Route path="/reminders"    element={<ProtectedLayout><Reminders /></ProtectedLayout>} />
    </Routes>
  );
}

const App=()=> {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;