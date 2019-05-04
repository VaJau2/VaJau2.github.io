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
    map.flyToBounds(tempBounds);
  }
  mapLayers[layerNum]._layers[pointNum].openPopup();
}

function openFindPanel() {
  if(findPanel.style.visibility == 'hidden') {
    findPanel.style.visibility = 'visible';
  }
  else {
    findPanel.style.visibility = 'hidden';
  }
}

function closeAskOnePoint() {
  askOnePoint.style.visibility = 'hidden';
}

function cancelCriteria() {
  findInput1.value = '';
  findInput2.selectedIndex = 0;
  findInput3.value = '';
  findInput4.value = '';
  findInput5.value = '';
  findInput6.value = '';
}

function findActive() {
  //тк активов может быть несколько, нужно создать их массив
  var tempPoints = [];
  var queryName = findInput4.value.toLowerCase();
  var querySpecific = findInput2.options[findInput2.selectedIndex].value.toLowerCase();
  var queryNumber = findInput3.value.toLowerCase();
  var queryAdress = findInput5.value.toLowerCase();
  var queryHolder = findInput6.value.toLowerCase();
  var tempLayerNum = 0;
  var tempPointNum = 0;

    //проходим по всем реестрам
    for(var i = 0; i < mapLayers.length; i++)
    {
      for(var j in mapLayers[i]._layers) {
        if(map.hasLayer(mapLayers[i])) {
          let mapName = mapLayers[i]._layers[j].feature.properties.Name.toLowerCase();
          let mapSpecific = mapLayers[i]._layers[j].feature.properties.Specific.toLowerCase();
          let mapNumber = mapLayers[i]._layers[j].feature.properties.RegNum.toLowerCase();
          let mapAdress = mapLayers[i]._layers[j].feature.properties.Adress.toLowerCase();
          let mapHolder = mapLayers[i]._layers[j].feature.properties.BalHolder.toLowerCase();
          if(mapName.includes(queryName) && mapSpecific.includes(querySpecific) &&
        mapNumber.includes(queryNumber) && mapAdress.includes(queryAdress) && mapHolder.includes(queryHolder)) {
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
      findPanel.style.visibility = 'hidden';
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
      findPanel.style.visibility = 'hidden';
    }
};

findPanelHeader.onmousedown = function(e) {
  var coords = getCoords(findPanel);
  var shiftX = e.pageX - coords.left;
  var shiftY = e.pageY - coords.top;

  findPanel.style.position = 'absolute';
  document.body.appendChild(findPanel);
  moveAt(e);

  findPanel.style.zIndex = 1000;

  function moveAt(e) {
    findPanel.style.left = e.pageX - shiftX + 'px';
    findPanel.style.top = e.pageY - shiftY + 'px';
  }

  document.onmousemove = function(e) {
    moveAt(e);
  };

  findPanelHeader.onmouseup = function() {
    document.onmousemove = null;
    findPanel.onmouseup = null;
  };

}

findPanelHeader.ondragstart = function() {
  return false;
};

askOnePointHeader.onmousedown = function(e) {
  var coords = getCoords(askOnePoint);
  var shiftX = e.pageX - coords.left;
  var shiftY = e.pageY - coords.top;

  askOnePoint.style.position = 'absolute';
  document.body.appendChild(askOnePoint);
  moveAt(e);

  askOnePoint.style.zIndex = 1000;

  function moveAt(e) {
    askOnePoint.style.left = e.pageX - shiftX + 'px';
    askOnePoint.style.top = e.pageY - shiftY + 'px';
  }

  document.onmousemove = function(e) {
    moveAt(e);
  };

  askOnePointHeader.onmouseup = function() {
    document.onmousemove = null;
    askOnePoint.onmouseup = null;
  };

}

askOnePointHeader.ondragstart = function() {
  return false;
};


function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}


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

function hideLayer(checked, layerNum) {
  if(checked) {
    if(!map.hasLayer(mapLayers[layerNum])) {
      mapLayers[layerNum].addTo(map);
      console.log("show layer");
    }
  }
  else {
    if(map.hasLayer(mapLayers[layerNum])) {
       mapLayers[layerNum].removeFrom(map);
       console.log("hide layer");
    }
  }
}

//плавно двигаем менюшку справа при нажатии на кнопку скрытия
hideButton.onclick = function(e) {
  if(panedInRight.style.right == "0%") {
    animate({
          duration: 300,
          timing: function(timeFraction) {
            return timeFraction;
          },
          draw: function(progress) {
            mapid.style.width = 75 + progress * 25 + '%';
            panedInRight.style.right = -progress * 25 + '%';
          }
        });
  }
  else {
    animate({
          duration: 300,
          timing: function(timeFraction) {
            return Math.pow(timeFraction, 2);
          },
          draw: function(progress) {
            mapid.style.width = 100 - progress * 25 + '%';
            panedInRight.style.right = -25 + progress * 25 + '%';
          }
        });
  }
}


function animate(options) {

  var start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction от 0 до 1
    var timeFraction = (time - start) / options.duration;
    if (timeFraction > 1) timeFraction = 1;

    // текущее состояние анимации
    var progress = options.timing(timeFraction)

    options.draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}
