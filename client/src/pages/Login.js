import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Alert } from '@mui/material';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token); // Save JWT
            localStorage.setItem('user', JSON.stringify(res.data.user));
            alert('Login Successful!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">EV Sign In</Typography>
                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        variant="outlined" margin="normal" required fullWidth
                        label="Email Address"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined" margin="normal" required fullWidth
                        label="Password" type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;