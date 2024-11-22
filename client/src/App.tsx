import { Routes, Route, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Manage } from "./pages/Manage";
import { Transactions } from "./pages/Transactions";
import { Navbar } from "./components/Navbar";
import { Wizard } from "./pages/Wizard";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";

function App() {
  return (
    <Routes>
      {/* Protected Routes with Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/manage" element={<ProtectedRoute element={<Manage />} />} />
        <Route path="/transactions" element={<ProtectedRoute element={<Transactions />} />} />
      </Route>

      {/* Protected Routes without Navbar */}
      <Route path="/wizard" element={<ProtectedRoute element={<Wizard />} />} />

      {/* Public Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;