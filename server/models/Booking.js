const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const ChargingPoint = require('./ChargingPoint');

const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    status: { 
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'), 
        defaultValue: 'pending' 
    },
    totalPrice: { type: DataTypes.DECIMAL(10, 2) }
});

// Relationships
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

ChargingPoint.hasMany(Booking, { foreignKey: 'pointId' });
Booking.belongsTo(ChargingPoint, { foreignKey: 'pointId' });

module.exports = Booking;