PflegeMap.routerController = {
  scope: this,

  layer: new ol.layer.Vector({
    opacity: 1,
    source: new ol.source.Vector({
      features: []
    })
  }),

  initSearchTool: function() {
    PflegeMap.searchTools.push('routingSearch');
  },

  initLayer: function() {
    this.layer.setMap(PflegeMap.map);
    this.errMsgElement = $('#PflegeMap\\.routingMessage')[0];
  },

  setEventHandler: function() {
    $('#PflegeMap\\.routingSearchTool').on(
      'click',
      this,
      PflegeMap.mapper.switchSearchTools
    );

    // add popup function handlers
    $('#PflegeMap\\.popup .pm-popup-function-from').off();
    $('#PflegeMap\\.popup .pm-popup-function-from').on(
      'click',
      {
        routeField: $('#PflegeMap\\.sourceField'),
        popup: PflegeMap.popup
      },
      this.openRouteSearch
    );
    $('#PflegeMap\\.popup .pm-popup-function-to').off();
    $('#PflegeMap\\.popup .pm-popup-function-to').on(
      'click',
      {
        routeField: $('#PflegeMap\\.targetField'),
        popup: PflegeMap.popup
      },
      this.openRouteSearch
    );

    $('#PflegeMap\\.calcRouteButton').click(this, this.loadRoute);
    $('#PflegeMap\\.removeRouteButton').click(this.removeRoute);
    $('#PflegeMap\\.MessageBoxClose').click(function() {
      $('#PflegeMap\\.MessageBox').animate({'top':'-200px'},500,function(){
        $('#PflegeMap\\.Overlay').fadeOut('fast');
      });
    });
  },

  loadRoute : function(e) {
    var scope = e.data,
        url  = 'osm2poServiceProxy.php',
        source = $('#PflegeMap\\.sourceField').attr('coordinates') || $('#PflegeMap\\.sourceField').val(),
        target = $('#PflegeMap\\.targetField').attr('coordinates') || $('#PflegeMap\\.targetField').val(),
        queryString = 'Route von: ' + source + ' nach: ' + target,
        hint = '';

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
        source: source,
        target: target
      },

      // Work with the response
      success: function(response) {
        if (response.indexOf('Error') != -1 || response.indexOf('Fehler') != -1) {
          if (source == '')
            hint = 'Keine Angaben für den Startpunkt: ' + source;
          console.log(source);
          if (target == '')
            hint = 'Keine Angaben für den Zielpunkt: ' + target;
          console.log(target);
          if (source == target)
            hint = 'Start: ' + source + ' und Zielpunkt: ' + target + ' sind identisch';
          scope.showErrorMsg(scope, hint || 'Kein Ergebnis für ' + queryString + '<br>' + response);
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
  },

  removeRoute: function(scope) {
    var source = PflegeMap.router.layer.getSource(),
        features = source.getFeatures();

    $('#PflegeMap\\.sourceField').attr('coordinates', '');
    $('#PflegeMap\\.sourceField').val('');
    $('#PflegeMap\\.sourceField').prop('readonly', false);
    $('#PflegeMap\\.targetField').attr('coordinates', '');
    $('#PflegeMap\\.targetField').val('');
    $('#PflegeMap\\.targetField').prop('readonly', false);
  },

  openRouteSearch: function(event) {
    var currFeature = event.data.popup.target.feature;
    var routeField = event.data.routeField;
    
    routeField.attr('coordinates', currFeature.latlng().join(', '));
    routeField.val(currFeature.address());
    routeField.prop('readonly', true);
    debug_r = { "target" : $('#PflegeMap\\.routingSearchTool')[0] };
    PflegeMap.mapper.switchSearchTools({ "target" : $('#PflegeMap\\.routingSearchTool')[0]});
  }
};