import React from 'react'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Maps = () => {
     // Sample coordinates for Goa locations
  const mapCenter = [15.2993, 74.1240];
  const locations = [
    { id: 1, name: "Baga Beach", lat: 15.5559, lng: 73.7516, type: "beach" },
    { id: 2, name: "Basilica of Bom Jesus", lat: 15.5008, lng: 73.9115, type: "heritage" },
    { id: 3, name: "Fort Aguada", lat: 15.5166, lng: 73.7722, type: "fort" },
    { id: 4, name: "Fisherman's Wharf", lat: 15.2832, lng: 73.9685, type: "restaurant" }
  ];
  return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ">
              <div className="h-80 ">
                <MapContainer
                  center={mapCenter}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-t-xl"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {locations.map((location) => (
                    <Marker key={location.id} position={[location.lat, location.lng]}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-gray-900">{location.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{location.type}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
                
                
              </div>
            </div>
  )
}

export default Maps