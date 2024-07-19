"use client"

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';







const prefectures = [
  { name: "北海道", code: "01" },
  { name: "北方領土", code: "00" }, // 通常、北方領土は公式の都道府県コードには含まれませんが、例示のために"00"としています。
  { name: "青森県", code: "02" },
  { name: "岩手県", code: "03" },
  { name: "宮城県", code: "04" },
  { name: "秋田県", code: "05" },
  { name: "山形県", code: "06" },
  { name: "福島県", code: "07" },
  { name: "茨城県", code: "08" },
  { name: "栃木県", code: "09" },
  { name: "群馬県", code: "10" },
  { name: "埼玉県", code: "11" },
  { name: "千葉県", code: "12" },
  { name: "東京都", code: "13" },
  { name: "東京都島嶼", code: "130" }, // 特別なケースとして追加
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



// 地図上にGeoJSONを表示するカスタムフック
function useGeoJson(url, map) {

  useEffect(() => {
    let geoJsonLayer;
    if (url && map) {
      fetch(url)
        .then(response => response.json())
        .then(data => {


          geoJsonLayer = L.geoJson(data, {

            style: {
              color: '#0000ff',
              weight: 2,
              opacity: 0.6,
              fillOpacity: 0.1,
              fillColor: '#0000ff'
            },

            onEachFeature: (feature, layer) => {
              layer.bindPopup(`${feature.properties.g}<b>${feature.properties.t}</b><br>団体コード＝ ${feature.properties.c}`);
              layer.on({
                mouseover: (e) => {
                  e.target.setStyle({
                    color: '#ff0000',
                    fillColor: '#ff0000'
                  });
                },
                mouseout: (e) => {
                  geoJsonLayer.resetStyle(e.target);
                }
              });
            }



          }).addTo(map);
          map.fitBounds(geoJsonLayer.getBounds());
        })
        .catch(console.error);

      return () => {
        if (geoJsonLayer) {
          map.removeLayer(geoJsonLayer);
        }
      };
    }
  }, [url, map]);
}

const MapComponent = ({ geoJsonUrl }) => {
  const map = useMap();
  useGeoJson(geoJsonUrl, map);

  return null;
};

const handlePrefectureChange = (event) => {
  setSelectedPrefecture(event.target.value);
};



export default function MapPage() {


  const [selectedPrefecture, setSelectedPrefecture] = useState('1');
  const [geoJsonUrl, setGeoJsonUrl] = useState(`GeoJsons/1.geojson`);
  //const geoJsonUrl = `GeoJsons/${selectedPrefecture}.geojson`;

  useEffect(() => {
    const loadGeoJSON = async (prefectureCode) => {
      try {
        const response = await axios.get(`./GeoJsons/${prefectureCode}.geojson`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to load geojson:', error);
        setData(null);
      }
    };

    loadGeoJSON(selectedPrefecture);
  }, [selectedPrefecture]);



  return (

    
    <div>


      <select value={selectedPrefecture} onChange={handlePrefectureChange}>
        {prefectures.map((prefecture) => (
          <option key={prefecture.code} value={prefecture.code}>
            {prefecture.name}
          </option>
        ))}
      </select>


      <MapContainer center={[35.51, 134.64]} zoom={5} style={{ height: '480px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&amp;copy <a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
        />
        <MapComponent geoJsonUrl={geoJsonUrl} />
      </MapContainer>

      <select value={selectedPrefecture} onChange={(e) => handlePrefectureChange(e)}>
        {/* 都道府県のオプションを追加 */}
        <option value="1">北海道</option>
        <option value="0">北方領土</option>
        <option value="2">青森県</option>
        <option value="3">岩手県</option>
        <option value="4">宮城県</option>
        <option value="5">秋田県</option>
        <option value="6">山形県</option>
        <option value="7">福島県</option>
        <option value="8">茨城県</option>
        <option value="9">栃木県</option>
        <option value="10">群馬県</option>
        <option value="11">埼玉県</option>
        <option value="12">千葉県</option>
        <option value="13">東京都</option>
        <option value="130">東京都島嶼</option>
        <option value="14">神奈川県</option>
        <option value="15">新潟県</option>
        <option value="16" selected="selected">富山県</option>
        <option value="17">石川県</option>
        <option value="18">福井県</option>
        <option value="19">山梨県</option>
        <option value="20">長野県</option>
        <option value="21">岐阜県</option>
        <option value="22">静岡県</option>
        <option value="23">愛知県</option>
        <option value="24">三重県</option>
        <option value="25">滋賀県</option>
        <option value="26">京都府</option>
        <option value="27">大阪府</option>
        <option value="28">兵庫県</option>
        <option value="29">奈良県</option>
        <option value="30">和歌山県</option>
        <option value="31">鳥取県</option>
        <option value="32">島根県</option>
        <option value="33">岡山県</option>
        <option value="34">広島県</option>
        <option value="35">山口県</option>
        <option value="36">徳島県</option>
        <option value="37">香川県</option>
        <option value="38">愛媛県</option>
        <option value="39">高知県</option>
        <option value="40">福岡県</option>
        <option value="41">佐賀県</option>
        <option value="42">長崎県</option>
        <option value="43">熊本県</option>
        <option value="44">大分県</option>
        <option value="45">宮崎県</option>
        <option value="46">鹿児島県</option>
        <option value="47">沖縄県</option>
        {/* 他の都道府県のオプション */}
      </select>
    </div>
  );
}

