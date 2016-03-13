PflegeMap.reachArea = function(origin, coordinates) {
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
        )
      ]
    ),
    type: 'ReachPolygon',
    name: 'Erreichbarkeitsgebiet'
  }),

  origin = new ol.Feature({
    type: 'ReachAreaOrigin',
    geometry: new ol.geom.Point(
      ol.proj.fromLonLat(
        [
          origin.lon,
          origin.lat
        ],
        PflegeMap.viewProjection
      )
    ),
    name: origin.name
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
  
  origin.setStyle(
    new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: 'images/SearchPoint.png'
      }))
    })
  );

  origin.select = function() {
    // origin kann nicht selectiert werden
    // selectiere statt dessen das Polygon
  }

  polygon.origin = origin;

  polygon.data = function() {
    var html  = this.origin.get('name');
    return html;
  };

  polygon.latlng = function() {
    var lnglat = ol.proj.transform(this.origin.getGeometry().getCoordinates(), PflegeMap.viewProjection, PflegeMap.baseProjection);
    return [lnglat[1], lnglat[0]];
  };

  polygon.preparePopup = function() {
    PflegeMap.popup.feature = this;
    $('#PflegeMap\\.popup').attr('class','pm-popup pm-suchergebnis');
    $('#PflegeMap\\.popup-title').html('Erreichbarkeitsgebiet');
    $('#PflegeMap\\.popup-data').html(this.data());
    $('.pm-popup-function-clear').attr('controller','reacher');
  };

  polygon.select = function() {
    this.preparePopup();
    PflegeMap.popup.setPosition(
      this.origin.getGeometry().getCoordinates()
    );
  };

  polygon.unselect = function() {
    PflegeMap.popup.setPosition(undefined);
  };

  return polygon;
}