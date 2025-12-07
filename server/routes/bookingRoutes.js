const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getOwnerBookings, updateBookingStatus } = require('../controllers/bookingController');
const { verifyToken, isOwner } = require('../middleware/authMiddleware');

// User Routes
router.post('/', verifyToken, createBooking);
router.get('/my-bookings', verifyToken, getMyBookings);

// Owner Routes
router.get('/owner-bookings', verifyToken, isOwner, getOwnerBookings); // View requests
router.put('/:id/status', verifyToken, isOwner, updateBookingStatus); // Accept/Reject

module.exports = router;