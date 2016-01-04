PflegeMap.reachArea = function(startPoint, coordinates) {
  var polygon = new ol.Feature({
    geometry: new ol.geom.Polygon(
      [ $.map(
        coordinates,
        function (c, i) {
          return [ol.proj.transform(
            c,
            'EPSG:4326',
            PflegeMap.viewProjection
          )];
        }
      )]
    ),
    type: 'ReachPolygon'
  });

  polygon.setStyle(
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 0, 255, 255],
        width: 5,
        opacity: 0.5
      }),
      fill: new ol.style.Fill({
        color: 'rgba(100, 100, 255, 0.3)'
      })
    })
  );

  return {
    polygon: polygon,
    startPoint: new PflegeMap.searchResult(
      startPoint.name,
      startPoint.lat,
      startPoint.lon
    )
  };
}