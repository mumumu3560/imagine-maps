"use client"

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapBounds from './MapBounds';
import MapEvent from './mapEvent';

const MapComponent = ({ center, zoom, data, onEachFeature }) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '90vh', width: '100%' }}>
      <TileLayer
        attribution='© <a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data && <GeoJSON data={data} onEachFeature={onEachFeature}/>}
      <MapBounds geojsonData={data} />
      <MapEvent/>
    </MapContainer>
  );
};

export default MapComponent;