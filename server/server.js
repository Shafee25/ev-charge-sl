const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); // Database connection
const authRoutes = require('./routes/authRoutes');
const pointRoutes = require('./routes/pointRoutes');
const path = require('path'); // Node native module for file paths

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// This makes the 'uploads' folder publicly accessible via URL
// e.g., http://localhost:5000/uploads/image-123.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/points', pointRoutes);

// --- Server Start & Database Sync ---
const PORT = process.env.PORT || 5000;

// use { alter: true } to update tables if you add new columns/tables
// use { force: true } only if you want to wipe all data and start fresh
sequelize.sync({ alter: true }) 
    .then(() => {
        console.log("✅ Database Connected & Synced");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.log("❌ Database Error:", err));