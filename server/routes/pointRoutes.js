const express = require('express');
const router = express.Router();
const { createPoint, getMyPoints, getAllPoints } = require('../controllers/pointController');
const { verifyToken, isOwner } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// ==========================================
// 👇 THIS IS THE MISSING PART CAUSING 404
// ==========================================
// Public Route (Anyone can see points)
router.get('/', getAllPoints); 


// ==========================================
// Protected Routes (Only Owners with Token)
// ==========================================
router.post('/create', verifyToken, isOwner, upload.single('image'), createPoint);
router.get('/my-points', verifyToken, isOwner, getMyPoints);

module.exports = router;