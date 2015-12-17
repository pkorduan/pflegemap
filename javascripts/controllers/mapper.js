PflegeMap.mapperController = function() { return {
  scope: this,
  
  // dummy zum Testen bitte löschen
  proximityRadius: 10000, // umkreis in Meter
  proximityExtent: PflegeMap.map.getView().calculateExtent(PflegeMap.map.getSize()),
  
  layer: new ol.layer.Vector({
    opacity: 1,
    source: new ol.source.Vector({
      features: []
    })
  }),

  list: {
    add: function(feature) {
      var element = feature.listElement();
      element.click();
      this.div.append( element );
    }
  },

  initLayer: function(store) {
    var i,
        source = this.layer.getSource();

    for (i = 0; i < store.length; i++) {
      source.addFeature(
        new PflegeMap.angebot(
          store[i]
        )
      );
    }

    this.layer.setMap(PflegeMap.map);

  },

  initSearchTools: function() {
    PflegeMap.searchTools.push('textSearch');
    PflegeMap.searchTools.push('categorySearch');
    PflegeMap.searchTools.push('proximitySearch');
  },

  initList: function() {
    this.list.div = $('#PflegeMap\\.careServicesList');

    var source = this.layer.getSource(),
        features = source.getFeatures();

    for (var i = 0; i < features.length; i++) {
      this.list.add(features[i]);
    }
  },

  setEventHandlers: function() {
    $('#PflegeMap\\.proximitySearchTool').on(
      'click',
      this,
      this.switchSearchTools
    );

    $('#PflegeMap\\.categorySearchTool').on(
      'click',
      this,
      this.switchSearchTools
    );

    $('#PflegeMap\\.textSearchTool').on(
      'click',
      this,
      this.switchSearchTools
    );

    // Handler for thematic search
    $('#PflegeMap\\.textSearchField').on(
      'input',
      this,
      this.themeSearch
    );

    // Handler für Kategorie-Checkboxen
    $(".cb-kat").on(
      'change',
      this,
      this.switchCategoryCheckBox
    );
    
    // handler for popup's proximity search
    $('#PflegeMap\\.popup .pm-popup-function-nearby').off();
    $('#PflegeMap\\.popup .pm-popup-function-nearby').on(
      'click',
      {
        mapper: this,
        popup: PflegeMap.popup,
        proximity: this.proximityRadius
      },
      function (event) {
        var data = event.data,
            feature = data.popup.feature;
        data.mapper.proximityExtent = data.mapper.calculateProximityExtent(feature, data.proximity);
      }
    );

  },

  themeSearch: function(event) {
    debug_e = event;
    console.log('Search with this text: ' + event.target.value);
    if (event.target.value.length == 0) {
      $('#PflegeMap\\.textSearchResultBox').html('');
      $('#PflegeMap\\.textSearchResultBox').hide();
    }
    else if (event.target.value.length == 1) {
      $('#PflegeMap\\.textSearchResultBox').show();
      $('#PflegeMap\\.textSearchResultBox').append('Eingabe: ' + event.target.value);
    }
    else {
      $('#PflegeMap\\.textSearchResultBox').append('<br>Eingabe: ' + event.target.value);
    }
  },

  switchCategoryCheckBox: function(event) {
    var scope = event.data;

    scope.switchCategorie(
      event.target.getAttribute('kategorie'),
      event.target.checked
    );
  },
  
  switchSearchTools: function(event) {
    $.each(PflegeMap.searchTools, function(index, searchTool) {
      $('#PflegeMap\\.' + searchTool + 'Area').hide();
    });
    $('#PflegeMap\\.' + event.target.getAttribute('toolname') + 'Area').show();
  },

  /*
   * Switch the visibility of all features with category c
   * to the visibility v
   * @params(string) c category (2 characters)
   * @params(boolean) v visibility
   * @return(void)
   */
  switchCategorie: function(c, v) {
    var source = this.layer.getSource(),
      features = source.getFeatures(),
      i,
      all_categories = (c == 'all');

    if (all_categories) $(".cb-kat").prop('checked', v);

    for ( i = 0; i < features.length; i++) {
      if (c == features[i].get('kategorie') || all_categories) {
        var hidden = v ? !(v && this.featureWithinProximity(features[i])) : !v;
        features[i].set('hidden', hidden);
        features[i].changed();
        (v)
          ? $('#PflegeMap\\.careService_' + features[i].get('id')).show()
          : $('#PflegeMap\\.careService_' + features[i].get('id')).hide();
      }
    }

    this.layer.changed();
  },
  
  featureWithinProximity: function(feature){
     return ol.extent.containsCoordinate(this.proximityExtent,feature.getGeometry().getCoordinates());
  },
  
  calculateProximityExtent: function(feature, radius){
//    var layerProjection = this.layer.getSource().getProjection(),
    var layerProjection = PflegeMap.map.getView().getProjection(),
        metricProjection = 'EPSG:25833';
    var isMetric = layerProjection.getUnits() == 'm';
//    var isMetric = layerProjection.code == metricProjection;
    var featureGeom = feature.getGeometry().clone();
    featureGeom = isMetric ? featureGeom : featureGeom.transform(layerProjection, metricProjection);
    var minCoord = featureGeom.clone();
    minCoord.translate(-radius,-radius);
    var maxCoord = featureGeom.clone();
    maxCoord.translate(radius,radius);
    var proximityExtent = ol.extent.extend(minCoord.getExtent(),maxCoord.getExtent());
    proximityExtent = isMetric ? proximityExtent : ol.proj.transformExtent(proximityExtent, metricProjection, layerProjection);
    return proximityExtent;
  },
  
  determineLocalUtmZone: function(geometryObj){
    var center = geometryObj.getExtend().getCenter(),
        projection = geometryObj.getProjection(),
        lonLat = ol.proj.toLonLat(center,projection.code),
        utmZone = (Math.floor((lonLat[0]+180)/6) % 60) + 1;
    
    return 'EPSG:258'+utmZone;
  },

  zeigeEinrichtungen: function(store, layer) {
    var features = [];
    for (var i = 0; i < store.length; i++){
      var feature = new PflegeMap.angebot(store[i]);
      features.push(feature);
    }
    layer.setSource(new ol.source.Vector({
      features: features
    }));
    
    // Vektorlayer zur Karte hinzufügen
    vektorLayer.setMap(map);
  }

};};