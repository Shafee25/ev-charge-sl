const Booking = require('../models/Booking');
const ChargingPoint = require('../models/ChargingPoint');
const User = require('../models/User');

// 1. Create a new Booking
exports.createBooking = async (req, res) => {
    try {
        const { pointId, startTime, endTime } = req.body;
        const userId = req.user.id; // From JWT Token

        // --- VALIDATION LOGIC ---
        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        // Check if Start Time is in the past
        if (start < now) {
            return res.status(400).json({ message: "Booking time cannot be in the past." });
        }

        // Check if End Time is before Start Time
        if (end <= start) {
            return res.status(400).json({ message: "End time must be after start time." });
        }
        // ------------------------

        // Get Point details to calculate price
        const point = await ChargingPoint.findByPk(pointId);
        if (!point) return res.status(404).json({ message: "Station not found" });

        // Calculate duration in hours
        const hours = (end - start) / 36e5; // Divide milliseconds by 3.6e6 to get hours

        if (hours <= 0) return res.status(400).json({ message: "Invalid time duration" });

        // Calculate Price
        const estimatedPrice = hours * point.pricePerKwh; 

        // Save Booking
        const newBooking = await Booking.create({
            userId,
            pointId,
            startTime,
            endTime,
            totalPrice: estimatedPrice,
            status: 'pending'
        });

        res.status(201).json({ message: "Booking Request Sent!", booking: newBooking });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get User's Bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [{ model: ChargingPoint, attributes: ['title', 'address'] }],
            order: [['startTime', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Incoming Bookings for an Owner
exports.getOwnerBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { 
                    model: ChargingPoint, 
                    where: { ownerId: req.user.id }, // Only points owned by this user
                    attributes: ['title']
                },
                {
                    model: User, // Include who booked it
                    attributes: ['username', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Booking Status (Approve/Reject)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const { id } = req.params;

        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        booking.status = status;
        await booking.save();

        res.json({ message: `Booking ${status}`, booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};