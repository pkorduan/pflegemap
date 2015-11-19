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
    this.errMsgElement = $('#PflegeMap\\.routingMessage')[0];
  },

  setEventHandler: function() {
    $('#PflegeMap\\.calcRouteButton').click(this, this.loadRoute);
    $('#PflegeMap\\.MessageBoxClose').click(function() {
      $('#PflegeMap\\.MessageBox').animate({'top':'-200px'},500,function(){
        $('#PflegeMap\\.Overlay').fadeOut('fast');
      });
    });
  },

  loadRoute : function(e) {
    var scope = e.data,
        url  = 'osm2poServiceProxy.php';

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
      success: function(response) {
        if (response.indexOf('Error') != -1 || response.indexOf('Fehler') != -1) {
          scope.showErrorMsg(scope, response);
        }
        else {
          scope.errMsgElement.innerHTML = '';
          scope.showRoute(response);
        }
      },

      error: function (xhr, ajaxOptions, thrownError){
        if(xhr.status==404) {
          scope.showErrorMsg(scope, thrownError);
        }
      }
    });
  },

  showErrorMsg: function(e, msg) {
    if (msg == 'Not Found') {
      msg = 'Der Routing Service ist nicht erreichbar. Bitte prüfen Sie ob Sie eine Netzverbindung haben.';
    }
    e.errMsgElement.innerHTML = msg;
    $('#PflegeMap\\.Overlay').fadeIn(200,function(){
      $('#PflegeMap\\.MessageBox').animate({'top':'20px'},200);
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
    );

    PflegeMap.map.getView().fit(
      route.line.getGeometry().getExtent(),
      PflegeMap.map.getSize()
    );
  }
};