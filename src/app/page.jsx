"use client"

import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import MapEvent from './components/mapEvent';
//import prefectures from './components/prefectures_const'
//import onEachFeature from './components/onEachFeature_logic'

import styles from './page.module.css';


const prefectures = [
  { name: "北海道", code: "1" },
  //{ name: "北方領土", code: "0" }, // 通常、北方領土は公式の都道府県コードには含まれませんが、例示のために"00"としています。
  { name: "青森県", code: "2" },
  { name: "岩手県", code: "3" },
  { name: "宮城県", code: "4" },
  { name: "秋田県", code: "5" },
  { name: "山形県", code: "6" },
  { name: "福島県", code: "7" },
  { name: "茨城県", code: "8" },
  { name: "栃木県", code: "9" },
  { name: "群馬県", code: "10" },
  { name: "埼玉県", code: "11" },
  { name: "千葉県", code: "12" },
  { name: "東京都", code: "13" },
  //{ name: "東京都島嶼", code: "130" }, // 特別なケースとして追加
  { name: "神奈川県", code: "14" },
  { name: "新潟県", code: "15" },
  { name: "富山県", code: "16" },
  { name: "石川県", code: "17" },
  { name: "福井県", code: "18" },
  { name: "山梨県", code: "19" },
  { name: "長野県", code: "20" },
  { name: "岐阜県", code: "21" },
  { name: "静岡県", code: "22" },
  { name: "愛知県", code: "23" },
  { name: "三重県", code: "24" },
  { name: "滋賀県", code: "25" },
  { name: "京都府", code: "26" },
  { name: "大阪府", code: "27" },
  { name: "兵庫県", code: "28" },
  { name: "奈良県", code: "29" },
  { name: "和歌山県", code: "30" },
  { name: "鳥取県", code: "31" },
  { name: "島根県", code: "32" },
  { name: "岡山県", code: "33" },
  { name: "広島県", code: "34" },
  { name: "山口県", code: "35" },
  { name: "徳島県", code: "36" },
  { name: "香川県", code: "37" },
  { name: "愛媛県", code: "38" },
  { name: "高知県", code: "39" },
  { name: "福岡県", code: "40" },
  { name: "佐賀県", code: "41" },
  { name: "長崎県", code: "42" },
  { name: "熊本県", code: "43" },
  { name: "大分県", code: "44" },
  { name: "宮崎県", code: "45" },
  { name: "鹿児島県", code: "46" },
  { name: "沖縄県", code: "47" }
];



function MapBounds({ geojsonData , prefecture}) {
  const map = useMap();

  useEffect(() => {
    if (geojsonData) {
      /*
      if(prefecture == 13){

        setCenter([35.5494, 139.5676]);
        setZoom(8);
        return;
      }
      */
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
    // ポップアップが開かれたら、ボタンにイベントリスナーを追加
    const button = document.getElementById('showCommentButton');
    if (button) {
      button.addEventListener('click', () => {
        console.log('ボタンがクリックされました！');
        // ここにボタンクリック時の処理を記述
      });
    }
  });

  layer.on('popupclose', (e) => {
    // ポップアップが閉じられたら、イベントリスナーを削除
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

//const center = [35.3628, 138.7307];


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



  /*
  
35.54936040857786
lng
: 
139.56756591796878
  */

  

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
