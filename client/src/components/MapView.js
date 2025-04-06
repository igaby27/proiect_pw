import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function MapView() {
  return (
    <MapContainer
      center={[45.9432, 24.9668]} 
      zoom={6}
      scrollWheelZoom={false}
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[45.9432, 24.9668]}>
        <Popup>
          România<br /> Centru.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
