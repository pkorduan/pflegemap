PflegeMap.proximiterController = {
  scope: this,

  // dummy zum Testen bitte löschen
/*  proximityRadius: -1, // kein Umkreis gegeben, Umkreis in Meter
  proximityExtent: PflegeMap.maxExtent,
  proximityCenter: map.getView().getCenter(),
*/
  initSearchTool: function() {
    PflegeMap.searchTools.push('proximitySearch');
  },

  setEventHandler: function() {
    $('#PflegeMap\\.proximitySearchTool').on(
      'click',
      this,
      PflegeMap.mapper.switchSearchTools
    );

    $('#PflegeMap\\.proximitySearchField').on(
      'change',
      this,
      PflegeMap.geocoder.lookupNominatim
    );
    
    // handler for popup's proximity search
    $('#PflegeMap\\.popup .pm-popup-function-proximity-search').off();
    $('#PflegeMap\\.popup .pm-popup-function-proximity-search').on(
      'click',
      {
        proximiter: this,
        popup: PflegeMap.popup,
      },
      this.proximitySearch
    );

    $('#pm-popup-proximity-select').off();
    $('#pm-popup-proximity-select').on(
      'change',
      {
        proximiter: this,
        popup: PflegeMap.popup,
      },
      function (event) {
        var data = event.data,
            mapTarget = data.popup.target,
            radius = Number(event.target.value);
        data.proximiter.proximityRadius = radius;
        data.proximiter.proximityExtent = data.proximiter.calculateProximityExtent(mapTarget, radius);
        data.proximiter.proximityCenter = ol.extent.getCenter(data.proximiter.proximityExtent);
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

  proximitySearch: function(event) {
    var data = event.data,
        popup = data.popup,
        proximiter = data.proximiter
        mapTarget = data.popup.target,
        radius = Number($('#pm-popup-proximity-select').val());

    PflegeMap.mapper.searchAnimation.show();

    proximiter.proximityRadius = radius;
    proximiter.proximityExtent = data.proximiter.calculateProximityExtent(mapTarget, radius);
    proximiter.proximityCenter = ol.extent.getCenter(data.proximiter.proximityExtent);

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
    var source = data.mapper.layer.getSource(),
      features = source.getFeatures(),
      viewExtent = ol.extent.createEmpty();
    features.forEach(function(feature){
      if (!feature.get('hidden'))
        ol.extent.extend(
          viewExtent,
          feature.getGeometry().getExtent());
    });
    
    // buffer extent with a fraction of the proximity radius
    viewExtent = ol.extent.buffer(
      viewExtent,
      proximiter.proximityRadius > 0 ? proximiter.proximityRadius / 10 : 0
    );
    
    // zoom to buffered viewExtent
    PflegeMap.map.getView().fit(
      viewExtent,
      PflegeMap.map.getSize()
    );

    // dismiss popup
    popup.setPosition(undefined);

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
  }
 
}