import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import OwnerDashboard from './pages/OwnerDashboard';
import AddPoint from './pages/AddPoint';


function Home() {
    return (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h3">Welcome to EV Charge Sri Lanka</Typography>
            <Typography variant="h6" color="textSecondary">Find power, everywhere.</Typography>
        </Box>
    );
}

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        ⚡ EV Charge SL
                    </Typography>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                    <Button color="inherit" component={Link} to="/register">Register</Button>
                </Toolbar>
            </AppBar>
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<OwnerDashboard />} />
                <Route path="/add-point" element={<AddPoint />} />
            </Routes>
        </Router>
    );
}

export default App;