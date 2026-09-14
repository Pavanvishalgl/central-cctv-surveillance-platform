import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapViewer = ({ cameras }) => {
  const center = [22.2587, 71.1924];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-700 relative z-0">
      <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {cameras.map((cam) => (
          <Marker key={cam.id} position={[cam.latitude, cam.longitude]}>
            <Popup>
              <div className="text-gray-900">
                <h3 className="font-bold">{cam.camera_name}</h3>
                <p className="text-xs text-gray-500 mb-1">{cam.camera_code}</p>
                <div className="text-sm space-y-1">
                  <p><strong>Dept:</strong> {cam.department}</p>
                  <p><strong>Loc:</strong> {cam.location_name}</p>
                  <p><strong>Protocol:</strong> {cam.protocol}</p>
                  <p>
                    <strong>Status:</strong> 
                    <span className={`ml-1 px-2 py-0.5 rounded text-xs text-white ${cam.status === 'ACTIVE' ? 'bg-green-500' : cam.status === 'INACTIVE' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                      {cam.status}
                    </span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
export default MapViewer;
