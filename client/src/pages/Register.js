import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, MenuItem } from '@mui/material';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/register', formData);
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            alert('Registration Failed');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Create Account</Typography>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
                    <TextField name="username" label="Username" fullWidth margin="normal" onChange={handleChange} required />
                    <TextField name="email" label="Email" fullWidth margin="normal" onChange={handleChange} required />
                    <TextField name="password" label="Password" type="password" fullWidth margin="normal" onChange={handleChange} required />
                    <TextField select name="role" label="Role" fullWidth margin="normal" value={formData.role} onChange={handleChange}>
                        <MenuItem value="user">EV Driver</MenuItem>
                        <MenuItem value="owner">Station Owner</MenuItem>
                    </TextField>
                    <Button type="submit" fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;