import React, { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Utensils, Camera, Landmark } from 'lucide-react';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const typeMeta = {
  attraction: {
    label: 'Attractions',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: <Landmark className="w-4 h-4 text-blue-600" />,
  },
  restaurant: {
    label: 'Restaurants',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    icon: <Utensils className="w-4 h-4 text-emerald-600" />,
  },
  experience: {
    label: 'Experiences',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    icon: <Camera className="w-4 h-4 text-purple-600" />,
  },
};

const FitBounds = ({ positions }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!positions.length) return;
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [positions, map]);

  return null;
};

const parseCoordinate = (value) => {
  if (value === null || value === undefined) return null;
  const numeric = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isFinite(numeric) ? numeric : null;
};

const Maps = ({ data }) => {
  const defaultCenter = [15.2993, 74.124];

  const markers = useMemo(() => {
    if (!data?.days?.length) {
      console.log('Map Debug: No days data', { data, hasDays: !!data?.days });
      return [];
    }

    const points = [];

    data.days.forEach((day) => {
      const dayNumber = day?.day_number;

      (day?.attractions || []).forEach((item) => {
        const lat = parseCoordinate(item?.latitude);
        const lng = parseCoordinate(item?.longitude);
        if (lat === null || lng === null) return;
        points.push({
          id: `attraction-${item?.id}-${dayNumber}`,
          position: [lat, lng],
          name: item?.name,
          description: item?.description,
          address: item?.address,
          type: 'attraction',
          day: dayNumber,
          title: day?.title,
        });
      });

      (day?.restaurants || []).forEach((item) => {
        const lat = parseCoordinate(item?.latitude);
        const lng = parseCoordinate(item?.longitude);
        if (lat === null || lng === null) return;
        points.push({
          id: `restaurant-${item?.id}-${dayNumber}`,
          position: [lat, lng],
          name: item?.name,
          description: item?.description,
          address: item?.address,
          type: 'restaurant',
          day: dayNumber,
          title: day?.title,
        });
      });

      (day?.experiences || []).forEach((item) => {
        const lat = parseCoordinate(item?.latitude);
        const lng = parseCoordinate(item?.longitude);
        if (lat === null || lng === null) return;
        points.push({
          id: `experience-${item?.id}-${dayNumber}`,
          position: [lat, lng],
          name: item?.name,
          description: item?.description,
          address: item?.address,
          type: 'experience',
          day: dayNumber,
          title: day?.title,
        });
      });
    });

    console.log('Map Debug: Final markers count:', points.length, { points, data });
    return points;
  }, [data]);

  const mapCenter = useMemo(() => {
    if (!markers.length) return defaultCenter;
    const latAvg = markers.reduce((sum, marker) => sum + marker.position[0], 0) / markers.length;
    const lngAvg = markers.reduce((sum, marker) => sum + marker.position[1], 0) / markers.length;
    return [latAvg, lngAvg];
  }, [markers]);

  const countsByType = useMemo(() => {
    return markers.reduce(
      (acc, marker) => {
        acc[marker.type] = (acc[marker.type] || 0) + 1;
        return acc;
      },
      { attraction: 0, restaurant: 0, experience: 0 }
    );
  }, [markers]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
     

      <div className=" h-80">
        {markers.length ? (
          <MapContainer
            center={mapCenter}
            zoom={markers.length === 1 ? 13 : 11}
            style={{ height: '100%', width: '100%' }}
            className="rounded-b-2xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {markers.length > 1 && (
              <FitBounds positions={markers.map((marker) => marker.position)} />
            )}

            {markers.map((marker) => {
              const meta = typeMeta[marker.type];
              return (
                <Marker key={marker.id} position={marker.position}>
                  <Popup>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {marker.name}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta?.bg} ${meta?.color}`}>
                          {meta?.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Day {marker.day}: {marker.title}</p>
                      {marker.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {marker.description}
                        </p>
                      )}
                      {marker.address && (
                        <div className="flex items-start gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                          <span>{marker.address}</span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gray-50">
            <div className="p-4 rounded-full bg-white mb-3">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Nothing to map just yet</p>
            <p className="text-xs text-gray-500 mt-1">Add locations with latitude and longitude to visualise them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maps;




