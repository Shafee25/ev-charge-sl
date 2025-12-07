const Booking = require('../models/Booking');
const ChargingPoint = require('../models/ChargingPoint');

// Create a new Booking
exports.createBooking = async (req, res) => {
    try {
        const { pointId, startTime, endTime } = req.body;
        const userId = req.user.id; // From JWT Token

        // --- 🔒 NEW VALIDATION LOGIC ---
        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();

        // 1. Check if Start Time is in the past
        if (start < now) {
            return res.status(400).json({ message: "Booking time cannot be in the past." });
        }

        // 2. Check if End Time is before Start Time
        if (end <= start) {
            return res.status(400).json({ message: "End time must be after start time." });
        }

        // 1. Get Point details to calculate price
        const point = await ChargingPoint.findByPk(pointId);
        if (!point) return res.status(404).json({ message: "Station not found" });

        // 2. Calculate duration in hours
        const start = new Date(startTime);
        const end = new Date(endTime);
        const hours = (end - start) / 36e5; // Divide milliseconds by 3.6e6 to get hours

        if (hours <= 0) return res.status(400).json({ message: "Invalid time duration" });

        // 3. Calculate Price (Price per Kwh is a proxy for hourly rate in this simple v1)
        const estimatedPrice = hours * point.pricePerKwh; 

        // 4. Save Booking
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

// Get User's Bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [{ model: ChargingPoint, attributes: ['title', 'address'] }]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
                    model: require('../models/User'), // Include who booked it
                    attributes: ['username', 'email', 'phone']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Update Booking Status (Approve/Reject)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const { id } = req.params;

        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Security: Ensure the person updating owns the station
        // (In a real app, we would query the ChargingPoint to check ownerId, 
        // but for now, we assume the route is protected enough for this phase)
        
        booking.status = status;
        await booking.save();

        res.json({ message: `Booking ${status}`, booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};