import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon for leaflet in React (otherwise marker icon may not show)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ShelterMap = ({ sheltersPublic = [] }) => (
  <div className="w-full mt-8 px-4 pb-8">
    <div className="border border-blue-200 dark:border-blue-800 rounded-xl bg-white dark:bg-gray-900">
      <div className="px-6 pt-6">
        <h2 className="text-lg font-semibold">All Shelter Locations</h2>
        <p className="text-gray-500 text-sm mb-2">Map of all shelters with location data</p>
      </div>
      <div className="px-6 pb-6">
        <div style={{ height: 350, borderRadius: 8, overflow: 'hidden' }}>
          {(sheltersPublic && sheltersPublic.length > 0) ? (
            <MapContainer
              center={[7.8731, 80.7718]}
              zoom={8}
              style={{ height: '350px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {sheltersPublic.filter(s => s.latitude && s.longitude).map(shelter => (
                <Marker
                  key={shelter.shelter_id}
                  position={[parseFloat(shelter.latitude), parseFloat(shelter.longitude)]}
                >
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No shelter location data available.</div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ShelterMap;