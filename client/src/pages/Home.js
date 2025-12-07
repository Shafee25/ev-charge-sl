import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Modal,
  TextField,
  Stack,
} from "@mui/material";
import axios from "../api/axios";
import MapHandler from "../components/MapHandler";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [points, setPoints] = useState([]);
  const [open, setOpen] = useState(false); // Modal state
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      const res = await axios.get("/points");
      setPoints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = (point) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please Login to Book!");
      navigate("/login");
      return;
    }
    setSelectedPoint(point);
    setOpen(true);
  };

  const handleBook = async () => {
    try {
      await axios.post("/bookings", {
        pointId: selectedPoint.id,
        startTime,
        endTime,
      });
      alert("Booking Successful!");
      setOpen(false);
    } catch (err) {
      alert("Booking Failed: " + (err.response?.data?.message || err.message));
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    // Adjust for timezone offset to get correct local time string
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16); // Returns "2025-12-04T15:30"
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "90vh",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: "400px",
          minWidth: "350px",
          bgcolor: "#f4f6f8",
          overflowY: "auto",
          p: 2,
          borderRight: "1px solid #ddd",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Stations ({points.length})
        </Typography>

        {points.map((point) => (
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
              <Typography variant="h6" fontWeight="bold">
                {point.title}
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{point.address}</Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Chip label={point.chargerType} color="primary" size="small" />
                <Typography variant="h6" color="green">
                  LKR {point.pricePerKwh}
                </Typography>
              </Box>
              {/* BOOK BUTTON */}
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleOpen(point)}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Map */}
      <Box sx={{ flex: 1 }}>
        {" "}
        <MapHandler points={points} />{" "}
      </Box>

      {/* Booking Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Book Slot: {selectedPoint?.title}
          </Typography>
          <Stack spacing={2}>
            <TextField 
                label="Start Time" 
                type="datetime-local" 
                InputLabelProps={{ shrink: true }} 
                // 👇 This prevents selecting past dates/times
                inputProps={{ min: getMinDateTime() }} 
                onChange={(e) => setStartTime(e.target.value)} 
            />
            <TextField
              label="End Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <Button variant="contained" color="success" onClick={handleBook}>
              Confirm Booking
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
