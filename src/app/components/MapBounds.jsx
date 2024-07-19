"use client"

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

function MapBounds({ geojsonData }) {
  const map = useMap();

  useEffect(() => {
    if (geojsonData) {
      const geoJsonLayer = L.geoJSON(geojsonData);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds);
      }
    }
  }, [geojsonData, map]);

  return null;
}

export default MapBounds;