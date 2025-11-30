import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardMedia, CardContent, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
    const [points, setPoints] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyPoints();
    }, []);

    const fetchMyPoints = async () => {
        try {
            const res = await axios.get('/points/my-points');
            setPoints(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container sx={{ mt: 5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <Typography variant="h4">My Charging Stations</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/add-point')}>
                    Add New Station
                </Button>
            </div>

            <Grid container spacing={3}>
                {points.map((point) => (
                    <Grid item xs={12} md={4} key={point.id}>
                        <Card>
                            {point.image && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={`http://localhost:5000/${point.image}`} // Serve from backend
                                    alt={point.title}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{point.title}</Typography>
                                <Typography variant="body2" color="textSecondary">{point.address}</Typography>
                                <div style={{ marginTop: 10 }}>
                                    <Chip label={point.chargerType} color="primary" size="small" sx={{ mr: 1 }} />
                                    <Chip label={`LKR ${point.pricePerKwh}/kWh`} color="success" size="small" />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default OwnerDashboard;