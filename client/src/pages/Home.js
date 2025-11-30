import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Chip, Paper } from '@mui/material';
import axios from '../api/axios';
import MapHandler from '../components/MapHandler';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Home = () => {
    const [points, setPoints] = useState([]);

    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        try {
            const res = await axios.get('/points');
            setPoints(res.data);
        } catch (err) {
            console.error("Error fetching points:", err);
        }
    };

    return (
        // 1. Main Container: Fixed Height (90% of screen), Flex Row
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '90vh', overflow: 'hidden' }}>
            
            {/* 2. LEFT SIDE: Sidebar List (Fixed Width: 400px) */}
            <Box sx={{ 
                width: '400px', 
                minWidth: '350px',
                backgroundColor: '#f4f6f8', 
                overflowY: 'auto', // Scrollable
                p: 2,
                borderRight: '1px solid #ddd'
            }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Stations ({points.length})
                </Typography>
                
                {points.length === 0 ? (
                    <Typography>No stations found.</Typography>
                ) : (
                    points.map((point) => (
                        <Card key={point.id} sx={{ mb: 2, boxShadow: 3 }}>
                            {point.image && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={point.image}
                                    alt={point.title}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold">{point.title}</Typography>
                                <Box display="flex" alignItems="center" sx={{ mb: 1, color: 'text.secondary' }}>
                                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">{point.address}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Chip label={point.chargerType} color="primary" size="small" />
                                    <Typography variant="h6" color="green">LKR {point.pricePerKwh}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>

            {/* 3. RIGHT SIDE: Map Area (Takes remaining space) */}
            <Box sx={{ flex: 1, position: 'relative' }}>
                {/* We pass the points to the map */}
                <MapHandler points={points} />
            </Box>

        </Box>
    );
};

export default Home;