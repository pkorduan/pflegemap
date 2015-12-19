PflegeMap.mapperController = function(map) { return {
  scope: this,
  map: map,

  // dummy zum Testen bitte löschen
  proximityRadius: -1, // kein Umkreis gegeben, Umkreis in Meter
  proximityExtent: PflegeMap.maxExtent,
  proximityCenter: map.getView().getCenter(),

  layer: new ol.layer.Vector({
    opacity: 1,
    source: new ol.source.Vector({
      projection: PflegeMap.viewProjection,
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

    this.layer.setMap(this.map);

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
    $('#PflegeMap\\.popup .pm-popup-function-proximity-search').off();
    $('#PflegeMap\\.popup .pm-popup-function-proximity-search').on(
      'click',
      {
        mapper: this,
        popup: PflegeMap.popup,
      },
      function (event) {
        var data = event.data,
            popup = data.popup,
            mapper = data.mapper;
        
        // switch visibility of angebote
        $(".cb-kat").each(function (){
          mapper.switchCategory($(this).attr('kategorie'), $(this).prop('checked'));
        });
        
        // calculate view extent that centers on filtered results
        var source = data.mapper.layer.getSource(),
          features = source.getFeatures(),
          viewExtent = ol.extent.createEmpty();
        features.forEach(function(feature){
          if (!feature.get('hidden'))
            ol.extent.extend(viewExtent, feature.getGeometry().getExtent());
        });
        
        // buffer extent with a fraction of the proximity radius
        viewExtent = ol.extent.buffer(
          viewExtent,
          mapper.proximityRadius > 0 ? mapper.proximityRadius / 10 : 0
        );
        
        // zoom to buffered viewExtent
        PflegeMap.map.getView().fit(viewExtent, PflegeMap.map.getSize());

        // dismiss popup
        popup.setPosition(undefined);
      }
    );

    $('#pm-popup-proximity-select').off();
    $('#pm-popup-proximity-select').on(
      'change',
      {
        mapper: this,
        popup: PflegeMap.popup,
      },
      function (event) {
        var data = event.data,
            mapTarget = data.popup.target,
            radius = Number(event.target.value);
        data.mapper.proximityRadius = radius;
        data.mapper.proximityExtent = data.mapper.calculateProximityExtent(mapTarget, radius);
        data.mapper.proximityCenter = ol.extent.getCenter(data.mapper.proximityExtent);
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

    scope.switchCategory(
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
  switchCategory: function(c, v) {
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
        (hidden)
          ? $('#PflegeMap\\.careService_' + features[i].get('id')).hide()
          : $('#PflegeMap\\.careService_' + features[i].get('id')).show();
      }
    }

    this.layer.changed();
  },
  
  featureWithinProximity: function(feature){
    var featureCoords = feature.getGeometry().getCoordinates(),
        centerCoords = this.proximityCenter;
        withinExtent = ol.extent.containsCoordinate(this.proximityExtent, featureCoords);
        withinDistance = withinExtent 
        ? ((featureCoords[0] - centerCoords[0])^2 + (featureCoords[0] - centerCoords[0])^2) > this.proximityRadius^2 
        : false;
    
    return withinDistance;
  },
  
  calculateProximityExtent: function(maptarget, radius){
    if (radius == -1) return PflegeMap.maxExtent; // no proximity specified
    var sourceProjection = PflegeMap.viewProjection,
//    var sourceProjection = this.map.getView().getProjection(),
        localUTMProjection = this.determineLocalUtmZone(maptarget.feature),
        needTransform = sourceProjection !== localUTMProjection,
        featureGeom = maptarget.feature.getGeometry().clone();
    
    featureGeom = needTransform 
      ? featureGeom.transform(sourceProjection, localUTMProjection)
      : featureGeom;
    
    var minCoord = featureGeom.clone(),
        maxCoord = featureGeom.clone();
    minCoord.translate(-radius,-radius);
    maxCoord.translate(radius,radius);
    
    var proximityExtent = ol.extent.extend(minCoord.getExtent(),maxCoord.getExtent());
    proximityExtent = needTransform 
      ? ol.proj.transformExtent(proximityExtent, localUTMProjection, sourceProjection)
      : proximityExtent;
      
    return proximityExtent;
  },
  
  determineLocalUtmZone: function(feature){
    var utmZone = (Math.floor((feature.latlng()[1]+180)/6) % 60) + 1;
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
    vektorLayer.setMap(this.map);
  }

};};