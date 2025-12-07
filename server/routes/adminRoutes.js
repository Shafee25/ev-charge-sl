const express = require('express');
const router = express.Router();
const { getPendingStations, approveStation, deleteStation } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/pending', verifyToken, isAdmin, getPendingStations);
router.put('/approve/:id', verifyToken, isAdmin, approveStation);
router.delete('/reject/:id', verifyToken, isAdmin, deleteStation);

module.exports = router;