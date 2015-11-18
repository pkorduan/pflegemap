PflegeMap.routerController = {
  scope: this,

  layer: new ol.layer.Vector({
    opacity: 1,
    source: new ol.source.Vector({
      features: []
    })
  }),

  initLayer: function() {
    this.layer.setMap(PflegeMap.map);
  },

  setEventHandler: function() {
    $('#PflegeMap\\.calcRouteButton').click(this, this.loadRoute);
  },

  loadRoute : function(e) {
    scope = e.data;
    var url  = 'osm2poServiceProxy.php';
    $.ajax({
      url: url,

      // The name of the callback parameter, as specified by the YQL service
      //jsonp: "callback",

      // Tell jQuery we're expecting JSONP
      //dataType: "json",

      // Tell YQL what we want and that we want JSON
      data: {
        cmd: 'fr',
        //format: 'geojson',
        source: $('#PflegeMap\\.sourceField')[0].value,
        target: $('#PflegeMap\\.targetField')[0].value
      },

      // Work with the response
      success: scope.showRoute
    });
  },

  showRoute: function(result) {
    var route = new PflegeMap.route(result),
        source = PflegeMap.router.layer.getSource(),
        features = source.getFeatures();

    if (features != null && features.length > 0) {
      for (x in features) {
        source.removeFeature(features[x]);
      }
    }

    source.addFeature(
      route.line
    );
    source.addFeature(
      route.sourcePoint
    );
    source.addFeature(
      route.targetPoint
    )
  },

  removeFeatures: function() {
    

  }
};