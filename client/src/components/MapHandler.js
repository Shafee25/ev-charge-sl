import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // 👈 IMPORTANT: This makes the map look right
import L from 'leaflet';

// --- Fix for Default Marker Icons ---
import iconUser from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: iconUser,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ------------------------------------

const center = [7.8731, 80.7718]; // Sri Lanka

const MapHandler = ({ points }) => {
    return (
        // 👇 FIX: changed height from "100%" to "80vh" (80% of screen height)
        <MapContainer 
            center={center} 
            zoom={8} 
            style={{ height: "100%", width: "100%" }} 
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {points.map((point) => (
                <Marker 
                    key={point.id} 
                    position={[point.latitude, point.longitude]}
                >
                    <Popup>
                        <div style={{ textAlign: "center" }}>
                            <h3>{point.title}</h3>
                            <p>{point.chargerType}</p>
                            <b>LKR {point.pricePerKwh}</b>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapHandler;