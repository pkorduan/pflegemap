PflegeMap.searchResult = function(name, lat, lon) {
  var feature = new ol.Feature({
    type: 'SearchResult',
    geometry: new ol.geom.Point([lon, lat]),
    name: name
  }),
  
  style = new ol.style.Style({
    image: new ol.style.Icon(({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      opacity: 0.75,
      src: 'data/icon.png'
    }))
  });
  
  feature.setStyle(style);
  
  return feature;
};
