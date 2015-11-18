PflegeMap.routePoint = function(name, type, coordinates) {
  var feature = new ol.Feature({
    type: type,
    geometry: new ol.geom.Point(coordinates),
    name: name
  });
  
  feature.setStyle(
    new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 64],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: 'images/' + ((type == 'SourcePoint') ? 'Source' : 'Target') + 'Flagg.png'
      }))
    })
  );

  return feature;
};
