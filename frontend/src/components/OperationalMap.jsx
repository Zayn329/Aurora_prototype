import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useOperationalState } from '../context/OperationalStateContext';
import { MapPin, Compass, AlertCircle } from 'lucide-react';

// Default custom marker icon
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Antarctic base stations synthetic GPS coordinates
const STATION_COORDINATES = [
  { name: 'McMurdo Base Station', lat: -77.846, lon: 166.668, status: 'OPERATIONAL' },
  { name: 'Amundsen-Scott South Pole Outpost', lat: -90.000, lon: 0.000, status: 'OPERATIONAL' },
  { name: 'Vostok Research Station', lat: -78.464, lon: 106.837, status: 'LIMITED' },
];

export default function OperationalMap() {
  const { missions, impactSet } = useOperationalState();

  const directlyImpactedIds = impactSet?.directly_impacted_mission_ids || [];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs font-semibold text-slate-800 flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-sky-600" />
          <span>Live Geo-Spatial Polar Operations Map</span>
        </h4>
        <span className="text-[11px] text-slate-500 font-mono">Antarctic Coordinate Sector</span>
      </div>

      <div className="h-[350px] border border-slate-100 rounded-md overflow-hidden z-0">
        <MapContainer
          center={[-78.0, 140.0]}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {STATION_COORDINATES.map((st) => (
            <Marker key={st.name} position={[st.lat, st.lon]} icon={customIcon}>
              <Popup>
                <div className="p-1 text-xs font-sans">
                  <div className="font-bold text-slate-900">{st.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Coordinates: {st.lat}, {st.lon}</div>
                  <div className="mt-1 px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold text-[10px] inline-block">
                    {st.status}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
