const express = require('express');
const router = express.Router();
const { createPoint, getMyPoints } = require('../controllers/pointController');
const { verifyToken, isOwner } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public Routes (No Token Needed)
router.get('/', getAllPoints); 

// Protected Routes (Owner Only)
// Note: 'image' matches the name attribute in the frontend form
router.post('/create', verifyToken, isOwner, upload.single('image'), createPoint);
router.get('/my-points', verifyToken, isOwner, getMyPoints);


module.exports = router;