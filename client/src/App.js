import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

// Context
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddPoint from "./pages/AddPoint";
import MyBookings from "./pages/MyBookings";
import OwnerBookings from "./pages/OwnerBookings";
import AdminDashboard from "./pages/AdminDashboard";

// --- NAVIGATION BAR COMPONENT ---
const NavBar = () => {
  const { user, logout, isOwner } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  // Helper to check if user is Admin
  const isAdmin = user?.role === "admin";

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout(); // 👈 Real Logout Trigger
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          component={Link}
          to="/"
        >
          ⚡ EV Charge SL
        </Typography>

        {/* Always Show Home/Search */}
        <Button color="inherit" component={Link} to="/">
          Search Maps
        </Button>

        {user ? (
          // --- LOGGED IN VIEW ---
          <>
            {/* Everyone can see their own bookings */}
            <Button color="inherit" component={Link} to="/my-bookings">
              My Trips
            </Button>

            {/* Only Owners see Station Management */}
            {isOwner() && (
              <>
                <Button
                  color="inherit"
                  sx={{ border: "1px solid white", ml: 1, mr: 1 }}
                  component={Link}
                  to="/dashboard"
                >
                  Manage Stations
                </Button>
                <Button color="inherit" component={Link} to="/owner-bookings">
                  Incoming Requests
                </Button>
              </>
            )}

            {/* 👇 NEW: ADMIN BUTTON (Only shows if role is admin) */}
            {isAdmin && (
              <Button
                color="inherit"
                component={Link}
                to="/admin"
                sx={{
                  bgcolor: "#d32f2f",
                  color: "white",
                  ml: 1,
                  "&:hover": { bgcolor: "#b71c1c" },
                }}
              >
                Admin Panel
              </Button>
            )}

            {/* User Profile Dropdown */}
            <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {user.username} ({user.role})
              </Typography>
              <IconButton size="large" onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          // --- GUEST VIEW ---
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

// --- PROTECTED ROUTE WRAPPER ---
const ProtectedRoute = ({ children, ownerOnly = false }) => {
  const { user, loading, isOwner } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  // 1. Not Logged In? -> Go Login
  if (!user) return <Navigate to="/login" />;

  // 2. Owner Route but User is not Owner? -> Go Home
  if (ownerOnly && !isOwner()) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Common Private Routes (User & Owner) */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Owner Only Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute ownerOnly={true}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-point"
            element={
              <ProtectedRoute ownerOnly={true}>
                <AddPoint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner-bookings"
            element={
              <ProtectedRoute ownerOnly={true}>
                <OwnerBookings />
              </ProtectedRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;