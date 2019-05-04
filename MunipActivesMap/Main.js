var mapLayers = [];

var map = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
 maxZoom: 18,
 attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
   '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
   'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
 id: 'mapbox.light'
}).addTo(map);

//функция, которая загружает всякие штуки с точками на карте
function onEachFeature(feature, layer) {
 var popupContent = buildPopupText(feature);
 var popup = layer.bindPopup(popupContent);
}

mapLayers.push(L.tileLayer.wms("http://pkk5.rosreestr.ru/arcgis/services/Cadastre/CadastreWMS/MapServer/WMSServer", {
 layers: "8",
 format: 'image/png',
 transparent: true,
 attribution: "Публичная кадастровая карта росреестра"
}).addTo(map));

mapLayers.push(L.tileLayer.wms("http://pkk5.rosreestr.ru/arcgis/services/Cadastre/CadastreWMS/MapServer/WMSServer", {
 layers: "9",
 format: 'image/png',
 transparent: true,
}).addTo(map));

//функция, которая создает текст для менюшки у активов
function buildPopupText(feature) {
  var popupContent = "";
  if(feature.properties.Specific)
  {
    popupContent += "<p>" + feature.properties.Specific + "</p>";
  }
  if (feature.properties.Name) {
    popupContent += "<p>Название: " + feature.properties.Name + "</p>";
  }
  if (feature.properties.Adress) {
    popupContent += "<p>Адрес: " + feature.properties.Adress + "</p>";
  }
  if (feature.properties.Area) {
    popupContent += "<p>Площадь: " + feature.properties.Area + "</p>";
  }
  if (feature.properties.BalHolder) {
    popupContent += "<p>Балансодержатель: " + feature.properties.BalHolder + "</p>";
  }
  if (feature.properties.BalHoldNum) {
    popupContent += "<p>Реестровый номер балансодержателя: " + feature.properties.BalHoldNum + "</p>";
  }
  if (feature.properties.FloorNum) {
    popupContent += "<p>Количество этажей: " + feature.properties.FloorNum + "</p>";
  }
  if (feature.properties.RegNum) {
    popupContent += "<p>Номер в реестре: " + feature.properties.RegNum + "</p>";
  }
  return popupContent;
}

//загружаем геожсон файл отдельно
mapLayers.push(L.geoJSON(NonLivingBuildsReestrGeoJSON,
 {
   onEachFeature: onEachFeature,
   style: function (feature) {
     return {color: '#3388ff'};
   }
 }).addTo(map));

mapLayers.push(L.geoJSON(FactoryReestrGeoJSON,
 {
   onEachFeature: onEachFeature,
   style: function (feature) {
     return {color: '#AA0551'};
   }
 }).addTo(map));

 mapLayers.push(L.geoJSON(EducationReestrGeoJSON,
   {
     onEachFeature: onEachFeature,
     style: function (feature) {
       return {color: '#42AB42'};
     }
   }).addTo(map));


map.setView(L.latLng([53.694503,55.059084]));
