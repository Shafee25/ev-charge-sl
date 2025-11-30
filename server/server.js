const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database Sync & Server Start
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }) // 'force: true' drops tables on restart. Keep 'false' for prod.
    .then(() => {
        console.log("✅ Database Connected & Synced");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.log("❌ Database Error:", err));