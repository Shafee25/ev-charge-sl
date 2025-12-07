const ChargingPoint = require('../models/ChargingPoint');
const User = require('../models/User');

// Get all Pending Stations
exports.getPendingStations = async (req, res) => {
    try {
        const stations = await ChargingPoint.findAll({
            where: { isApproved: false },
            include: [{ model: User, attributes: ['username', 'email'] }]
        });
        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve a Station
exports.approveStation = async (req, res) => {
    try {
        const { id } = req.params;
        await ChargingPoint.update({ isApproved: true }, { where: { id } });
        res.json({ message: "Station Approved and Live!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Station (Reject)
exports.deleteStation = async (req, res) => {
    try {
        const { id } = req.params;
        await ChargingPoint.destroy({ where: { id } });
        res.json({ message: "Station Rejected/Deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};