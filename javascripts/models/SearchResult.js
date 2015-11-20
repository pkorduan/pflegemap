PflegeMap.searchResult = function(name, lat, lon) {
  var feature = new ol.Feature({
    type: 'SearchResult',
    geometry: new ol.geom.Point(ol.proj.transform([lon, lat], PflegeMap.baseProjection, PflegeMap.viewProjection)),
    name: name
  }),
  
  style = new ol.style.Style({
    image: new ol.style.Icon(({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      opacity: 0.75,
      src: 'images/SearchPoint.png'
    }))
  });

  feature.setStyle(style);

  feature.data = function() {
    var html  = this.get('name') + '<br>';
        html += 'Koordinaten: ' + this.latlng();
    return html;
  };

  feature.address = function() {
    return this.get('name');
  };

  feature.xy = function() {
    var xy = this.getGeometry().getCoordinates();
    return xy[0] + ', ' + xy[1];
  };

  feature.latlng = function() {
    var lnglat = ol.proj.transform(this.getGeometry().getCoordinates(), PflegeMap.viewProjection, PflegeMap.baseProjection);
    return lnglat[1] + ', ' + lnglat[0];
  };

  feature.showPopUp = function() {
    $('#PflegeMap\\.popup-title').html('Suchbegriff');
    $('#PflegeMap\\.popup-data').html(this.data());
    $('#PflegeMap\\.popup-source').off();
    $('#PflegeMap\\.popup-source').on(
      'click',
      this,
      PflegeMap.router.openRouteSearch
    );
    $('#PflegeMap\\.popup-target').off();
    $('#PflegeMap\\.popup-target').on(
      'click',
      this,
      PflegeMap.router.openRouteSearch
    );
  };

  return feature;
};
