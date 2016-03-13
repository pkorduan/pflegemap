PflegeMap.proximiterController = function(map) {return {
  map: map,
  
  // initial values, ensuring complete coverage 
  proximityRadius: -1, // kein Umkreis gegeben, Umkreis in Meter
  proximityExtent: PflegeMap.maxExtent,
  proximityCenter: map.getView().getCenter(),

  initSearchTool: function() {
    PflegeMap.searchTools.push('proximitySearch');
  },

  setEventHandler: function() {
    self = this;
    $('#PflegeMap\\.proximitySearchTool').on(
      'click',
      self,
      PflegeMap.mapper.switchSearchTools
    );

    $('#PflegeMap\\.proximitySearchField').on(
      'change',
      self,
      PflegeMap.geocoder.lookupNominatim
      // on click auf ein ausgewählte Adresse wird this.addSearchResultFeature aufgerufen
    );
    
    // Nach Änderung des Umkreises im Suchbereich
    $('#PflegeMap\\.proximitySelect').off();
    $('#PflegeMap\\.proximitySelect').on(
      'change',
      function(event) {
        var coords = $('#PflegeMap\\.proximitySearchField').attr('coordinates');
            radius = Number(event.target.value);

        // synchronize with proximity select in popup
        $('#pm-popup-proximity-select').val(radius);
        if (typeof coords !== typeof undefined && coords !== false) {
          PflegeMap.mapper.filterFeatures();
          PflegeMap.mapper.zoomToExtent();
        }
      }
    );

/*
    $('#PflegeMap\\.popup .pm-popup-function-proximity-search').off();
    $('#PflegeMap\\.popup .pm-popup-function-proximity-search').on(
      'click',
      {
        popup: PflegeMap.popup,
        mapper: PflegeMap.mapper
      },
      function(event) {
        // do proximity filtering
        self.proximitySearch(self, event.data.mapper, event.data.popup.target);
        // dismiss popup
        event.data.popup.setPosition(undefined);
      }
    );
*/
    // Nach Änderung des Umkreises im Popup
    $('#pm-popup-proximity-select').off();
    $('#pm-popup-proximity-select').on(
      'change',
      {
        popup: PflegeMap.popup,
      },
      function (event) {
        var radius = Number(event.target.value);

        // synchronize with proximity select in search Area
        $('#PflegeMap\\.proximitySelect').val(radius);
        PflegeMap.mapper.filterFeatures();
        PflegeMap.mapper.zoomToExtent();
      }
    );
  },

  getSearchResultCallback: function(event, item) {
    return "PflegeMap.proximiter.addSearchResultFeature('" + item.display_name + "', " + item.lat + ", " + item.lon + ")";
  },

  getNoResultCallback: function() {
    return "PflegeMap.proximiter.removeSearchResult()";
  },

  /*
  * Filter care service features in proximity radius, zoom to extent and add marker in center
  */
  addSearchResultFeature: function(display_name, lat, lon) {
    PflegeMap.geocoder.addSearchResultFeature('proximitySearchField', display_name, lat, lon);
    PflegeMap.mapper.filterFeatures();
    PflegeMap.mapper.zoomToExtent();
  },

  removeSearchResult: function() {
    $('#PflegeMap\\.proximitySearchField').val("");
    $('#PflegeMap\\.proximitySearchField').removeAttr("coordinates");
    $('#PflegeMap\\.proximitySearchFieldResultBox').hide();

    PflegeMap.popup.setPosition(undefined);
    // remove map marker
    PflegeMap.geocoder.removeSearchResultFeatures(PflegeMap.geocoder);
  },

  proximitySearch: function(self, mapper, mapTarget) {
    
    PflegeMap.mapper.searchAnimation.show();
    
    self.proximityExtent = self.calculateProximityExtent(mapTarget, self.proximityRadius);
    self.proximityCenter = ol.extent.getCenter(self.proximityExtent);

    // switch visibility of angebote
    $(".cb-subkat").each(function (){
      
      mapper.switchSubCategory(
        $(this).attr('kategorie'),
        $(this).prop('checked')
      );
    });
    
    // calculate view extent that centers on filtered results
    var source = mapper.layer.getSource(),
      features = source.getFeatures(),
      viewExtent = ol.extent.createEmpty(),
      visisbleFeatures = features.filter(function(feature){
        return !feature.get('hidden');
      });
    visisbleFeatures.forEach(function(feature){
      ol.extent.extend(
        viewExtent,
        feature.getGeometry().getExtent());
    });
    
    // include the proximity's origin
    ol.extent.extend(viewExtent, self.proximityCenter.concat(self.proximityCenter));
    
    if (visisbleFeatures.length < 1)
      // ensure minimal extend as extent of search proximity
      ol.extent.extend(viewExtent, self.proximityExtent);
    else {
      // extend view to contain all results 
      visisbleFeatures.forEach(function(feature){
        ol.extent.extend(
          viewExtent,
          feature.getGeometry().getExtent());
      });

      // buffer extent with a fraction of the proximity radius in order to keep clear off the map's frame
      viewExtent = ol.extent.buffer(
        viewExtent,
        self.proximityRadius > 0 ? self.proximityRadius / 10 : 0
      );
    }
    
    // zoom to buffered viewExtent
    PflegeMap.map.getView().fit(
      viewExtent,
      PflegeMap.map.getSize()
    );
    
    PflegeMap.mapper.searchAnimation.hide();
  },

  /*
  * Liefert wahr zurück, wenn feature geometrisch im Umkreis
  * mit dem Radius aus dem Feld PflegeMap.proximitySelect liegt oder
  * wenn kein Radius gesetzt ist.
  */
  proximityFilter: function(feature) {
    var coords = $('#PflegeMap\\.proximitySearchField').attr('coordinates'),
        radius = $('#PflegeMap\\.proximitySelect').val();

    if (radius == -1)  // Wenn kein Radius gesetzt ist liefer true
      return true

    if (!(typeof coords !== typeof undefined && coords !== false))
      return feature.get('hidden');

    coords = coords.split(', ');
    var center = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([coords[1], coords[0]], PflegeMap.viewProjection)
      )
    }),
    wgs84Sphere = new ol.Sphere(6378137);

    return (
      wgs84Sphere.haversineDistance(
        ol.proj.transform(center.getGeometry().getCoordinates(), PflegeMap.viewProjection, 'EPSG:4326'),
        ol.proj.transform(feature.getGeometry().getCoordinates(), PflegeMap.viewProjection, 'EPSG:4326')
      ) < radius
    );
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
    
    featureGeom == needTransform 
      ? featureGeom.transform(sourceProjection, localUTMProjection)
      : featureGeom;
    
    var minCoord = featureGeom.clone(),
        maxCoord = featureGeom.clone();
    minCoord.translate(-radius,-radius);
    maxCoord.translate(radius,radius);
    
    var proximityExtent = ol.extent.extend(minCoord.getExtent(),maxCoord.getExtent());
    proximityExtent == needTransform 
      ? ol.proj.transformExtent(proximityExtent, localUTMProjection, sourceProjection)
      : proximityExtent;
      
    return proximityExtent;
  },
 
  determineLocalUtmZone: function(feature){
    var utmZone = (Math.floor((feature.latlng()[1]+180)/6) % 60) + 1;
    return 'EPSG:258'+utmZone;
  },
}};