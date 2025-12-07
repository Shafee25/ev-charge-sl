import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import axios from '../api/axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get('/bookings/my-bookings');
                setBookings(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBookings();
    }, []);

    // Color helper for status
    const getStatusColor = (status) => {
        if (status === 'approved') return 'success';
        if (status === 'rejected') return 'error';
        return 'warning'; // pending
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>My Charge History</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><b>Station</b></TableCell>
                            <TableCell><b>Date</b></TableCell>
                            <TableCell><b>Time</b></TableCell>
                            <TableCell><b>Price</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((b) => (
                            <TableRow key={b.id}>
                                <TableCell>{b.ChargingPoint?.title}</TableCell>
                                <TableCell>{new Date(b.startTime).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {new Date(b.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                    {new Date(b.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </TableCell>
                                <TableCell>LKR {b.totalPrice}</TableCell>
                                <TableCell>
                                    <Chip label={b.status.toUpperCase()} color={getStatusColor(b.status)} size="small" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default MyBookings;