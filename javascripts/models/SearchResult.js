PflegeMap.searchResult = function(name, lat, lon) {
  var feature = new ol.Feature({
    type: 'SearchResult',
    geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat], PflegeMap.viewProjection)),
    name: name,
    selected: false
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
    var html  = this.get('name') /*+ '<br>';
        html += '' + this.latlng().join(', ')*/;
    return html;
  };

  feature.address = function() {
    return this.get('name');
  };

  feature.addressText = function() {
    return this.get('name');
  };

  feature.xy = function() {
    var xy = this.getGeometry().getCoordinates();
    return xy[0] + ', ' + xy[1];
  };

  feature.latlng = function() {
    var lnglat = ol.proj.transform(this.getGeometry().getCoordinates(), PflegeMap.viewProjection, PflegeMap.baseProjection);
    return [lnglat[1], lnglat[0]];
  };

  feature.preparePopup = function() {
    PflegeMap.popup.feature = this;
    $('#PflegeMap\\.popup').attr('class','pm-popup pm-suchergebnis');
    $('#PflegeMap\\.popup-title').html('Suchergebnis');
    $('#PflegeMap\\.popup-data').html(this.data());
  };

  feature.unselect = function() {
    if (this.get('selected')) {
      //console.log('Unselect feature: ' + this.get('name'));
      // close Popup
      PflegeMap.popup.setPosition(undefined);

      // set this feature to unselected
      this.set('selected', false);
    }
  };

  feature.select = function() {
    if (!this.get('selected')) {
      //console.log('Select feature: ' + this.get('name'));

      // show popup
      //console.log('show popup');
      this.preparePopup();
      PflegeMap.popup.setPosition(
        this.getGeometry().getCoordinates()
      );

      // set this feature to selected
      this.set('selected', true);
      //console.log('set this feature: ' + this.get('name') + ' as selected Feature.');
      PflegeMap.mapper.selectedFeature = this;
    }
  };
  return feature;
};
