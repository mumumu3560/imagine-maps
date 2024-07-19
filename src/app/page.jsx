"use client"

import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const MapEvent = dynamic(() => import('./components/mapEvent'), { ssr: false });

const prefectures = [
  // 省略
];

function MapBounds({ geojsonData , prefecture}) {
  const map = useMap();

  useEffect(() => {
    if (geojsonData) {
      const geoJsonLayer = L.geoJSON(geojsonData);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) { // 確認境界が有効かどうか
        map.fitBounds(bounds);
      }
    }
  }, [geojsonData, map]);

  return null;
}

const onEachFeature = (feature, layer) => {
  const defaultStyle = {
    fillColor: 'green',
    weight: 2,
    opacity: 0.4,
    color: 'white',
    fillOpacity: 0.4
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

  const popupContent = `
    <div>
      <p>${feature.properties.N03_004}</p>
      <button id="showCommentButton">コメントを見る</button>
      <button id="postCommentButton">コメントを投稿する</button>
    </div>
  `;

  //N03_007→コード
  //layer.bindPopup (feature.properties.N03_004);
  layer.bindPopup(popupContent);

  layer.on('popupopen', (e) => {
    const button = document.getElementById('showCommentButton');
    if (button) {
      button.addEventListener('click', () => {
        console.log('ボタンがクリックされました！');
      });
    }
  });

  layer.on('popupclose', (e) => {
    const button = document.getElementById('showCommentButton');
    if (button) {
      button.removeEventListener('click', () => {
        // リスナーの削除処理
      });
    }
  });

  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight
  });
};

function App() {
  const [data, setData] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('22'); // 初期値は静岡県
  const [isLoading, setIsLoading] = useState(false); // ローディング状態を追加
  const [center, setCenter] = useState([35.3628, 138.7307]);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    const loadGeoJSON = async (prefectureCode) => {
      setIsLoading(true);
      try {
        setData("");
        console.log(prefectureCode);

        const response = await axios.get(`./GeoJsons/${prefectureCode}.geojson`);
        if(response) setData(response.data);

      } catch (error) {
        console.error('Failed to load geojson:', error);
        setData(null);
      } finally {
        setIsLoading(false); // データの読み込みが終了または失敗したらローディング状態をfalseに設定
      }
    };

    loadGeoJSON(selectedPrefecture);
  }, [selectedPrefecture]);

  const handlePrefectureChange = (event) => {
    setSelectedPrefecture(event.target.value);
  };

  return (
    <div>
      {isLoading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loader}></div> {/* ローディングスピナー */}
        </div>
      )}

      <select value={selectedPrefecture} onChange={handlePrefectureChange}>
        {prefectures.map((prefecture) => (
          <option key={prefecture.code} value={prefecture.code}>
            {prefecture.name}
          </option>
        ))}
      </select>
      <MapContainer center={center} zoom={zoom} style={{ height: '90vh', width: '100%' }}>
        <TileLayer
          attribution='© <a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data && <GeoJSON data={data} onEachFeature={onEachFeature}/>}
        <MapBounds geojsonData={data} prefecture={selectedPrefecture}/>
        <MapEvent/>
      </MapContainer>
    </div>
  );
}

export default App;
