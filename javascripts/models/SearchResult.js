PflegeMap.searchResult = function(name, lat, lon) {
  console.log('Create SearchResult Object: ' + name);
  return new ol.Feature({
    type: 'SearchResult',
    geometry: new ol.geom.Point([lon, lat]),
    name: name
  })
};
