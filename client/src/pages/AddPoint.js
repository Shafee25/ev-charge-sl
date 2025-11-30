import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  Stack,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddPoint = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    chargerType: "AC",
    pricePerKwh: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use FormData for file uploads
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (image) data.append("image", image);

    try {
      await axios.post("/points/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Station Added Successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to add station");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Register New Charging Point
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Station Name"
            name="title"
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            multiline
            rows={3}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="address"
            onChange={handleChange}
            required
          />

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              margin="normal"
              label="Latitude"
              name="latitude"
              type="number"
              inputProps={{ step: "any" }}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Longitude"
              name="longitude"
              type="number"
              inputProps={{ step: "any" }}
              onChange={handleChange}
              required
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Type"
              name="chargerType"
              value={formData.chargerType}
              onChange={handleChange}
            >
              <MenuItem value="AC">AC (Slow)</MenuItem>
              <MenuItem value="DC">DC (Fast)</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              label="Price (LKR/kWh)"
              name="pricePerKwh"
              type="number"
              inputProps={{ step: "any" }}
              onChange={handleChange}
              required
            />
          </Stack>

          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Upload Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {image && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Selected: {image.name}
            </Typography>
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Submit Station
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddPoint;
