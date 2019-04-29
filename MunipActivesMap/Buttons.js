//функция перемещает карту на актив и открывает его менюшку
function zoomTo(feature, layerNum, pointNum)
{
  var latLing = [];
  if(feature.geometry.coordinates.length == 2)
  {
    latLing = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
    map.flyTo(latLing);
  }
  else
  {
    var tempBounds = [[]];
    for(let i = 0; i < feature.geometry.coordinates[0].length; i++)
    {
      tempBounds[0].push([feature.geometry.coordinates[0][i][1], feature.geometry.coordinates[0][i][0]])
    }
    //latLing = feature.geometry.coordinates[0];
    console.log(feature.geometry.coordinates);
    map.flyToBounds(tempBounds);
  }
  mapLayers[layerNum]._layers[pointNum].openPopup();
}

//функционал кнопки поиска активов
FindButton.onclick = function() {
  //тк активов может быть несколько, нужно создать их массив
  var tempPoints = []
  var query = FindTextBox.value.toLowerCase();
  var tempLayerNum = 0;
  var tempPointNum = 0;
  if(query) {
    //проходим по всем реестрам
    for(var i = 0; i < mapLayers.length; i++)
    {
      //как можно достать до каждой точки в реестре
      for(var j in mapLayers[i]._layers)
      {
        if(map.hasLayer(mapLayers[i])) {
          let mapSpecific = mapLayers[i]._layers[j].feature.properties.Specific.toLowerCase();
          if(mapSpecific.includes(query)) {
            if(!tempPoints.includes(mapLayers[i]._layers[j].feature)) {
              tempPoints.push(mapLayers[i]._layers[j].feature);
              tempLayerNum = i;
              tempPointNum = j;
            }
          }
          let mapName = mapLayers[i]._layers[j].feature.properties.Name.toLowerCase();
          if(mapName.includes(query)) {
            if(!tempPoints.includes(mapLayers[i]._layers[j].feature)) {
              tempPoints.push(mapLayers[i]._layers[j].feature);
              tempLayerNum = i;
              tempPointNum = j;
            }
          }
          let mapAdress = mapLayers[i]._layers[j].feature.properties.Adress.toLowerCase();
          if(mapAdress.includes(query)) {
            if(!tempPoints.includes(mapLayers[i]._layers[j].feature)) {
              tempPoints.push(mapLayers[i]._layers[j].feature);
              tempLayerNum = i;
              tempPointNum = j;
            }
          }
        }
      }
    }

    if(tempPoints.length == 0) {
      alert("Поиск не дал результатов.");
    }
    else if(tempPoints.length == 1) { //если нашелся один актив, отправляемся на него
      zoomTo(tempPoints[0], tempLayerNum, tempPointNum);
    }
    else { //если нашлось несколько активов, загружаем менюшку с выбором одного из них
      askOnePointSelect.options.length = 0;
      for(var i = 0; i < tempPoints.length; i++)
      {
        var opt = document.createElement('option');
        opt.value = tempPoints[i].properties.Name.toString();
        opt.innerHTML = tempPoints[i].properties.Name.toString();
        askOnePointSelect.appendChild(opt);
      }
      askOnePoint.style.visibility = 'visible';
    }
  }
  else {
    alert("Введите название актива, его тип или адрес.");
  }
};

//функционал кнопки одного актива из нескольких во время поиска
askOnePointButton.onclick = function() {
  var pointName = askOnePointSelect.options[askOnePointSelect.selectedIndex].value;
  for(var i = 0; i < mapLayers.length; i++) {
    for(var j in mapLayers[i]._layers) {
      if(mapLayers[i]._layers[j].feature.properties.Name == pointName) {
        zoomTo(mapLayers[i]._layers[j].feature, i, j);
        break;
      }
    }

  }
  askOnePoint.style.visibility = 'hidden';
};

FilterButton.onclick = function() {
  for(var i = 0; i < FilterSelect.options.length; i++) {
    if(FilterSelect.options[i].selected) {
      if(!map.hasLayer(mapLayers[i])) {
        mapLayers[i].addTo(map);
      }
    }
    else {
      if(map.hasLayer(mapLayers[i])) {
         mapLayers[i].removeFrom(map);
      }
    }
  }
}

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
