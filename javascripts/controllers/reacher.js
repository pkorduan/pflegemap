PflegeMap.reacherController = {
  scope: this,
  
  name: "reacherController",

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
      //  alert('Diese Funktion ermittelt ausgehend von einer Adresse die Erreichbarkeit entlang von Strassen. Wählen Sie zuerst die gewünschte Fahrzeit aus und dann eine Adresse. Im Ergebnis wird Ihnen die Fläche der Orte angezeigt, die in der gewünschten Zeit erreicht werden können. Die Berechnung kann bei längeren Fahrzeiten bis zu einer Minute dauern.');
      }
    );

    $('#PflegeMap\\.reachSearchField').on(
      'change',
      this,
      PflegeMap.geocoder.lookupNominatim
      // on click auf ein ausgewählte Adresse wird this.getReachArea aufgerufen
    );
    
    $('#pm-popup-reach-select').on(
      'change',
      this,
      function(event) {
        var minutes = Number(event.target.value);

        // synchronize with reach select in search area
        $('#PflegeMap\\.reachMinutes').val(minutes);

        PflegeMap.reacher.getReachArea(
          $('#PflegeMap\\.popup').attr('name'),
          $('#PflegeMap\\.popup').attr('lat'),
          $('#PflegeMap\\.popup').attr('lon')
        );
      }
    );

    $('#PflegeMap\\.reachMinutes').on(
      'change',
      function(event) {
        var minutes = Number(event.target.value);

        // synchronize with reach select in popup
        $('#pm-popup-reach-select').val(minutes);

        PflegeMap.reacher.getReachArea(
          $('#PflegeMap\\.popup').attr('name'),
          $('#PflegeMap\\.popup').attr('lat'),
          $('#PflegeMap\\.popup').attr('lon')
        );

      }
    );

    // Beim Klick auf Markierung Löschen im Infofenster
    $('#PflegeMap\\.popup .pm-popup-function-clear').on(
      'click',
      this,
      function(event) {
        if ($(event.target).attr('controller') == 'reacher') {
          // hide popup
          PflegeMap.popup.setPosition(undefined);
          // remove marker and reach polygon
          PflegeMap.reacher.removeReachArea(event);
        }
      }
    );
    
    $('.pflegemap-reach-button').on(
      'click',
      this,
      this.removeReachArea
    );

  },

  getSearchResultCallback: function(event, item) {
    return "PflegeMap.reacher.getReachArea('" + item.display_name + "', " + item.lat + ", " + item.lon + ")";
  },

  getNoResultCallback: function() {
    return "PflegeMap.reacher.removeReachArea()";
  },

  getReachArea : function(name, lat, lon) {
    var target = $('#PflegeMap\\.reachSearchField');
    target.val(name);
    target.attr('coordinates', lat + ', ' + lon);
    $('#PflegeMap\\.reachSearchFieldResultBox').hide();

    $.ajax({
      url: PflegeMap.config.reachUrl,
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

      beforeSend: PflegeMap.mapper.searchAnimation.show,

      // Work with the response
      success: function(response) {
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
          PflegeMap.mapper.filterFeatures();
        }
      },

      error: function (xhr, ajaxOptions, thrownError){
        if(xhr.status==404) {
          PflegeMap.reacherController.showErrorMsg(thrownError);
        }
      },
      
      complete:  PflegeMap.mapper.searchAnimation.hide
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

  /*
  * Liefert war, wenn kein reachArea nicht existiert oder wenn
  * feature geometrisch im reachArea liegt.
  */
  reachAreaFilter: function(feature) {
    if (!PflegeMap.reacher.reachArea) return true;

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
    function isPointInPoly(poly, pt){
      for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
      return c;
    };
    
    var polyCoords = PflegeMap.reacher.reachArea.getGeometry().getCoordinates()[0].map(
      function(coordinate){
        return {x:coordinate[0],y:coordinate[1]};
      }),
      featCoords = {
        x:feature.getGeometry().getCoordinates()[0],
        y:feature.getGeometry().getCoordinates()[1]
      };

    return isPointInPoly(polyCoords, featCoords);
  },

  showReachArea: function(origin, reachAreaCoords) {
    this.reachArea = new PflegeMap.reachArea(origin, reachAreaCoords),
        source = PflegeMap.reacher.layer.getSource(),
        features = source.getFeatures();

    if (features != null && features.length > 0) {
      for (x in features) {
        source.removeFeature(features[x]);
      }
    }

    source.addFeature(
      this.reachArea
    );

    $('#PflegeMap\\.popup').attr('lat', origin.lat);
    $('#PflegeMap\\.popup').attr('lon', origin.lon);
    $('#PflegeMap\\.popup').attr('name', origin.name);

    source.addFeature(
      this.reachArea.origin
    );

//    PflegeMap.geocoder.addSearchResultFeature('reachSearchField', centerPoint.name, centerPoint.lat, centerPoint.lon);

    PflegeMap.map.getView().fit(
      this.reachArea.getGeometry().getExtent(),
      PflegeMap.map.getSize()
    );
  },
  
  removeReachArea: function(event) {
    var source = event.data.layer.getSource(),
        features = source.getFeatures();

    $('#PflegeMap\\.reachSearchField').attr('coordinates', '');
    $('#PflegeMap\\.reachSearchField').val('');

    if (features != null && features.length > 0) {
      for (x in features) {
        source.removeFeature( features[x] );
      }
    }
    PflegeMap.reacher.reachArea = undefined;
  }
};