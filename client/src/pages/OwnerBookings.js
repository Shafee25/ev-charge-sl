import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Grid, Chip, Box } from '@mui/material';
import axios from '../api/axios';

const OwnerBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/bookings/owner-bookings');
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const handleStatus = async (id, status) => {
        try {
            await axios.put(`/bookings/${id}/status`, { status });
            fetchRequests(); // Refresh list
        } catch (err) { alert("Update failed"); }
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>Incoming Booking Requests</Typography>
            <Grid container spacing={3}>
                {bookings.map((b) => (
                    <Grid item xs={12} md={6} key={b.id}>
                        <Card sx={{ borderLeft: b.status === 'pending' ? '5px solid orange' : '5px solid green' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="h6">{b.ChargingPoint?.title}</Typography>
                                    <Chip label={b.status} color={b.status === 'pending' ? 'warning' : b.status === 'approved' ? 'success' : 'error'} />
                                </Box>
                                <Typography color="textSecondary" sx={{ mt: 1 }}>
                                    Customer: <b>{b.User?.username}</b> ({b.User?.email})
                                </Typography>
                                <Typography sx={{ mt: 1 }}>
                                    📅 {new Date(b.startTime).toDateString()} <br/>
                                    ⏰ {new Date(b.startTime).toLocaleTimeString()} - {new Date(b.endTime).toLocaleTimeString()}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                    Revenue: LKR {b.totalPrice}
                                </Typography>

                                {b.status === 'pending' && (
                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                        <Button variant="contained" color="success" onClick={() => handleStatus(b.id, 'approved')}>
                                            Approve
                                        </Button>
                                        <Button variant="contained" color="error" onClick={() => handleStatus(b.id, 'rejected')}>
                                            Reject
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default OwnerBookings;