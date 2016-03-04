PflegeMap.routePoint = function(name, type, coordinates) {
  var feature = new ol.Feature({
    type: type,
    geometry: new ol.geom.Point(coordinates),
    name: name,
    selected: false
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

  feature.select = function() {
    console.log('Routenpunkt ausgewählt.');
    this.set('selected', true);
  };
  
  feature.unselect = function() {
    console.log('Routenpunkt abgewählt.');
    this.set('selected', false);
  };

  return feature;
};
