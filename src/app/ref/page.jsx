"use client"

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import MapEvent from './components/mapEvent';

const center = [35.3628, 138.7307];



function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    const load = async () => {
      let shizuoka = await axios.get('./GeoJsons/22.geojson');
      if (shizuoka) setData(shizuoka.data);
      console.log(shizuoka);
    };
    load();
  }, []);

  

  const onEachFeature = (feature, layer) => {
    const defaultStyle = {
      fillColor: 'green',
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };

    layer.setStyle(defaultStyle);

    const highlightFeature = (e) => {
      var layer = e.target;

      layer.setStyle({
        fillColor: 'blue',
        weight: 3,
        color: '#666',
        fillOpacity: 0.7
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
    };

    const resetHighlight = (e) => {
      layer.setStyle(defaultStyle);
    };

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight
    });
  };

  return (
    <MapContainer center={center} zoom={5} zoomControl={false} id="map" style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='© <a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data && <GeoJSON data={data} onEachFeature={onEachFeature} />}
      <MapEvent />
    </MapContainer>
  );
}

export default App;
