PflegeMap.proximiterController = {

  // dummy zum Testen bitte löschen
/*  proximityRadius: -1, // kein Umkreis gegeben, Umkreis in Meter
  proximityExtent: PflegeMap.maxExtent,
  proximityCenter: map.getView().getCenter(),
*/
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
    );
    
    // handler for search field's proximity search
    $('#PflegeMap\\.proximitySelect').off();
    $('#PflegeMap\\.proximitySelect').on(
      'change',
      {
        mapper: PflegeMap.mapper
      },
      function(event) {
        // do proximity filtering
        var layer = PflegeMap.geocoder.layer,
          radius = Number(event.target.value),
          mapTarget = {
            layer: layer,
            feature: layer.getSource().getFeatures()[0]
          };
        // synchronize popup select element
        $('#pm-popup-proximity-select').val(radius);
        // trigger search
        self.proximityRadius = radius;
        self.proximitySearch(self, event.data.mapper, mapTarget);
      }
    );

    // handler for popup's proximity search
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

    $('#pm-popup-proximity-select').off();
    $('#pm-popup-proximity-select').on(
      'change',
      {
        popup: PflegeMap.popup,
      },
      function (event) {
        var mapTarget = event.data.popup.target,
            radius = Number(event.target.value);
        // synchronize popup select element
        $('#PflegeMap\\.proximitySelect').val(radius);
        // set new value
        self.proximityRadius = radius;
      }
    );
  },

  getSearchResultCallback: function(event, item) {
    return "PflegeMap.proximiter.addSearchResultFeature('" + item.display_name + "', " + item.lat + ", " + item.lon + ")";
  },

  /*
  * Filter care service features in proximity radius, zoom to extent and add marker in center
  */
  addSearchResultFeature: function(display_name, lat, lon) {
    PflegeMap.geocoder.addSearchResultFeature('proximitySearchField', display_name, lat, lon);
  },

  proximitySearch: function(self, mapper, mapTarget) {
    
    PflegeMap.mapper.searchAnimation.show();
    
    self.proximityExtent = self.calculateProximityExtent(mapTarget, self.proximityRadius);
    self.proximityCenter = ol.extent.getCenter(self.proximityExtent);

    // switch visibility of angebote
    $(".cb-kat").each(function (){
     // console.log('versart: %o', $(this).attr('versart'));
    //  console.log('checked: %o', $(this).prop('checked'));
      
      mapper.switchCategory(
        $(this).attr('versart'),
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

}