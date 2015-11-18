PflegeMap.route = function(params) {
  var paramsToCoordinates = function(pointString) {
    var values = pointString.split(','),
        coordinates = [],
        i;
    for (i = 0; i < values.length; i += 2) {
      coordinates.push(
        ol.proj.transform(
          [
            values[i+1],
            values[i]
          ],
          'EPSG:4326',
          PflegeMap.viewProjection
        )
      );
    }
    return coordinates;
  },
  coordinates = paramsToCoordinates(params),
  line = new ol.Feature({
    geometry: new ol.geom.LineString(coordinates),
    type: 'Route'
  });

  line.setStyle(
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 0, 255, 255],
        width: 7,
        opacity: 0.5
      })
    })
  );
  console.log(coordinates[0]);
        console.log(coordinates[coordinates.length-1]);

  return {
    line: line,
    sourcePoint: new PflegeMap.routePoint(
      'Start',
      'SourcePoint',
      coordinates[0]
    ),
    targetPoint: new PflegeMap.routePoint(
      'Ziel',
      'TargetPoint',
      coordinates[coordinates.length - 1]
    )
  };
}