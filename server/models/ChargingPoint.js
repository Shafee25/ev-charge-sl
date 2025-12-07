const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const ChargingPoint = sequelize.define("ChargingPoint", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  isApproved: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false // By default, stations are HIDDEN until approved
    },
  description: { type: DataTypes.TEXT },
  address: { type: DataTypes.STRING, allowNull: false },
  latitude: { type: DataTypes.FLOAT, allowNull: false },
  longitude: { type: DataTypes.FLOAT, allowNull: false },
  chargerType: { type: DataTypes.ENUM("AC", "DC"), allowNull: false },
  pricePerKwh: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  image: { type: DataTypes.STRING }, // Path to uploaded image
  status: {
    type: DataTypes.ENUM("active", "maintenance"),
    defaultValue: "active",
  },
});

// Relationship: User (Owner) has many Charging Points
User.hasMany(ChargingPoint, { foreignKey: "ownerId" });
ChargingPoint.belongsTo(User, { foreignKey: "ownerId" });

module.exports = ChargingPoint;
