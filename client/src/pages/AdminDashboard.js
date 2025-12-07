import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Box, Grid } from '@mui/material';
import axios from '../api/axios';

const AdminDashboard = () => {
    const [stations, setStations] = useState([]);

    useEffect(() => { fetchPending(); }, []);

    const fetchPending = async () => {
        try {
            const res = await axios.get('/admin/pending');
            setStations(res.data);
        } catch (err) { console.error(err); }
    };

    const handleAction = async (id, action) => {
        try {
            if(action === 'approve') await axios.put(`/admin/approve/${id}`);
            else await axios.delete(`/admin/reject/${id}`);
            fetchPending(); // Refresh list
        } catch (err) { alert("Action failed"); }
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>Admin Moderation Panel</Typography>
            <Typography variant="subtitle1" color="textSecondary" mb={3}>
                Pending Approvals: {stations.length}
            </Typography>

            <Grid container spacing={3}>
                {stations.map((s) => (
                    <Grid item xs={12} md={6} key={s.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{s.title}</Typography>
                                <Typography color="textSecondary">Owner: {s.User?.username}</Typography>
                                <Typography variant="body2">{s.address}</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>Price: LKR {s.pricePerKwh}</Typography>
                                
                                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                    <Button variant="contained" color="success" onClick={() => handleAction(s.id, 'approve')}>
                                        Approve & Publish
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleAction(s.id, 'reject')}>
                                        Reject & Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AdminDashboard;