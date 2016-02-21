PflegeMap.route = function(params) {
  var routeObj = JSON.parse(params),
      coordinates = [],
      duration = 0,
      distance = 0,
      line;

  // take the first coordinates of the first segment of the route
  coordinates.push(
    ol.proj.transform(
      routeObj.features[0].geometry.coordinates[0],
      'EPSG:4326',
      PflegeMap.viewProjection
    )
  );

  // merge the coordinates despite of the first of each segment
  $.each(routeObj.features, function() {
    coordinates = $.merge(
      coordinates,
      $.map(
        this.geometry.coordinates.filter(
          function(coordinate, index) {
            return index > 0;
          }
        ),
        function(coordinate) {
          return [
            ol.proj.transform(
              coordinate,
              'EPSG:4326',
              PflegeMap.viewProjection
            )
          ]
        }
      )
    );
    duration += this.properties.time || 0;
    distance += this.properties.length || 0;
  });

  line = new ol.Feature({
    geometry: new ol.geom.LineString(
      coordinates
    ),
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
  }

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
    ),
    duration: duration,
    distance: distance
  };
}