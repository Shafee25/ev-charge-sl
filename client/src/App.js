import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

// --- IMPORTS ---
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import AddPoint from './pages/AddPoint';

// Import the REAL Home page with the Map
import Home from './pages/Home'; 

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }} component={Link} to="/">
                        ⚡ EV Charge SL
                    </Typography>
                    
                    {/* Navigation Buttons */}
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/dashboard">My Stations</Button>
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                    <Button color="inherit" component={Link} to="/register">Register</Button>
                </Toolbar>
            </AppBar>
            
            <Routes>
                {/* Now this points to the Map Page */}
                <Route path="/" element={<Home />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<OwnerDashboard />} />
                <Route path="/add-point" element={<AddPoint />} />
            </Routes>
        </Router>
    );
}

export default App;