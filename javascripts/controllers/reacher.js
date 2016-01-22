PflegeMap.reacherController = {
  scope: this,

  layer: new ol.layer.Vector({
    opacity: 1,
    source: new ol.source.Vector({
      features: []
    })
  }),

  initSearchTool: function() {
    PflegeMap.searchTools.push('reachSearch');
  },

  initLayer: function() {
    this.layer.setMap(PflegeMap.map);
    this.errMsgElement = $('#PflegeMap\\.errorMessage')[0];
  },

  setEventHandler: function() {
    $('#PflegeMap\\.reachSearchTool').on(
      'click',
      this,
      function(e) {
        PflegeMap.mapper.switchSearchTools(e);
        alert('Diese Funktion ermittelt ausgehend von einer Adresse die Erreichbarkeit entlang von Strassen. Wählen Sie zuerst die gewünschte Fahrzeit aus und dann eine Adresse. Im Ergebnis wird Ihnen die Fläche der Orte angezeigt, die in der gewünschten Zeit erreicht werden können. Die Berechnung kann bei längeren Fahrzeiten bis zu einer Minute dauern.');
      }
    );

    $('#PflegeMap\\.reachSearchField').on(
      'change',
      this,
      PflegeMap.geocoder.lookupNominatim
    );
  },

  getSearchResultCallback: function(event, item) {
    return "PflegeMap.reacher.getReachArea('" + item.display_name + "', " + item.lat + ", " + item.lon + ")";
  },

  getReachArea : function(name, lat, lon) {
    PflegeMap.geocoder.addSearchResultFeature('reachSearchField', name, lat, lon);

    console.log('Starte mit der Berechnung des Erreichbarkeitsgebietes.');
    $.ajax({
      url: PflegeMap.config.reachUrl + '?',
      data: {
        cmd: 'fx',
        schema: 'public',
        format: 'geojson',
        minutes: $('#PflegeMap\\.reachMinutes').val(),
        interval: $('#PflegeMap\\.reachMinutes').val(),
        hull: false,
        target: 0.7,
        featColl: true,
        createTabs: false,
        diffPolys: true,
        coords: (lat + ',' + lon)
      },

      // Work with the response
      success: function(response) {
        console.log('Berechnung des Erreichbarkeitsgebietes abgeschlossen.');
        if (response.Error != undefined || response.Fehler != undefined) {
          PflegeMap.reacherController.showErrorMsg('Kein Ergebnis für die Erreichbarkeitsanalyse mit der Anfrage' + '<br>' + response);
        }
        else {
          $('#PflegeMap\\.errorMessage').innerHTML = '';
          PflegeMap.reacherController.showReachArea(
            {
              "name" : name,
              "lat": lat,
              "lon": lon
            },
            response.features[0].geometry.coordinates[0]
          );
        }
      },

      error: function (xhr, ajaxOptions, thrownError){
        if(xhr.status==404) {
          PflegeMap.reacherController.showErrorMsg(thrownError);
        }
      }
    });
  },

  showErrorMsg: function(msg) {
    if (msg == 'Not Found') {
      msg = 'Der Errechbarkeitsdienst ist nicht erreichbar. Bitte prüfen Sie ob Sie eine Netzverbindung haben.';
    }
    PflegeMap.reacherController.errMsgElement.innerHTML = msg;
    $('#PflegeMap\\.Overlay').fadeIn(200,function(){
      $('#PflegeMap\\.MessageBox').animate({'top':'20px'},200);
    });
  },

  showReachArea: function(centerPoint, reachAreaCoords) {
    var reachArea = new PflegeMap.reachArea(centerPoint, reachAreaCoords),
        source = PflegeMap.reacher.layer.getSource(),
        features = source.getFeatures();

    if (features != null && features.length > 0) {
      for (x in features) {
        source.removeFeature(features[x]);
      }
    }

    console.log('add polygon');
    source.addFeature(
      reachArea.polygon
    );

    console.log('add startPoint');
    source.addFeature(
      reachArea.startPoint
    );

    PflegeMap.map.getView().fit(
      reachArea.polygon.getGeometry().getExtent(),
      PflegeMap.map.getSize()
    );
  },

  removeReachArea: function(scope) {
    var source = PflegeMap.reacher.layer.getSource(),
        features = source.getFeatures();

    $('#PflegeMap\\.sourceField').attr('coordinates', '');
    $('#PflegeMap\\.sourceField').val('');
    $('#PflegeMap\\.sourceField').prop('readonly', false);
    $('#PflegeMap\\.minutesField').val('');
    $('#PflegeMap\\.minutesField').prop('readonly', false);
  }
};