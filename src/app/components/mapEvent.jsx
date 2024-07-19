"use client"

import { useMapEvent } from "react-leaflet";

function MapEvent() {
  const map = useMapEvent("click", (location) => {
     map.setView(location.latlng, map.getZoom(), {
       animate: true,
     });    


     /*
     map.setView(location.latlng, map.getZoom(), {
       animate: true,
     });   
     */


    //ポップアップ
    // map.openPopup('<div>popup</div>', location.latlng)

    // ツールチップ
    // map.openTooltip('<p>toolTip</p>', location.latlng)

    //ズームイン・ズームアウト
    // map.zoomIn(1)
    // map.zoomOut(1)

    //現在の位置情報
    // map.locate({
    //     setView: true
    // })

    //中心
    // console.log(map.getCenter())

    //境界座標
    //console.log(map.getBounds())

    //マップサイズ
    // console.log(map.getSize()) 
  });
  
}

export default MapEvent;