const ChargingPoint = require('../models/ChargingPoint');

// Create new Charging Point
// server/controllers/pointController.js

exports.createPoint = async (req, res) => {
    try {
        const { title, description, address, latitude, longitude, chargerType, pricePerKwh } = req.body;
        
        // Fix: Normalize path for Windows (Change backslashes \ to forward slashes /)
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path.replace(/\\/g, "/"); 
        }

        const newPoint = await ChargingPoint.create({
            ownerId: req.user.id,
            title, 
            description, 
            address, 
            latitude, 
            longitude, 
            chargerType, 
            pricePerKwh, 
            image: imagePath // Save the normalized path
        });

        res.status(201).json(newPoint);
    } catch (error) {
        console.error("Error creating point:", error); // Log exact error to VS Code terminal
        res.status(500).json({ error: error.message });
    }
};

// Get Points belonging to the logged-in Owner
exports.getMyPoints = async (req, res) => {
    try {
        const points = await ChargingPoint.findAll({ where: { ownerId: req.user.id } });
        res.json(points);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get ALL Charging Points (Public)
exports.getAllPoints = async (req, res) => {
    try {
        const points = await ChargingPoint.findAll({
            where: { status: 'active' }, // Only show active points
            include: [{ 
                model: require('../models/User'), // Include Owner details
                attributes: ['username', 'email'] 
            }] 
        });
        
        // Add full image URL to response
        const pointsWithImages = points.map(point => {
            const pointData = point.toJSON();
            if (pointData.image) {
                // Replace backslashes for URL compatibility
                pointData.image = `http://localhost:5000/${pointData.image.replace(/\\/g, '/')}`;
            }
            return pointData;
        });

        res.json(pointsWithImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};