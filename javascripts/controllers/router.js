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
    this.errMsgElement = $('#PflegeMap\\.errorMessage')[0];
  },

  setEventHandler: function() {
    $('#PflegeMap\\.routingSearchTool').on(
      'click',
      this,
      PflegeMap.mapper.switchSearchTools
    );

    $('#PflegeMap\\.sourceField').on(
      'change',
      this,
      this.lookupNominatim
    );

    $('#PflegeMap\\.targetField').on(
      'change',
      this,
      this.lookupNominatim
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

    $('#PflegeMap\\.calcRouteButton').click(
      this, this.loadRoute
    );
    $('#PflegeMap\\.removeRouteButton').click(
      this.removeRoute
    );
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
        format: 'geojson',
        source: source,
        target: target
      },

      beforeSend: PflegeMap.mapper.searchAnimation.show,

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
          scope.showRoute(response, scope);
        }
      },

      error: function (xhr, ajaxOptions, thrownError){
        if(xhr.status==404) {
          scope.showErrorMsg(scope, thrownError);
        }
      },

      complete: PflegeMap.mapper.searchAnimation.hide

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

  showRoute: function(result, scope) {
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

    $('#PflegeMap\\.routingDuration').html(
      scope.durationFormatter(route.duration)
    );
    $('#PflegeMap\\.routingDistance').html(
      scope.distanceFormatter(route.distance)
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

    $('#PflegeMap\\.routingDuration').html();
    $('#PflegeMap\\.routingDistance').html();

    if (features != null && features.length > 0) {
      for (x in features) {
        source.removeFeature(features[x]);
      }
    }
    $('.pflegemap-routing-result').hide();
  },

  openRouteSearch: function(event) {
    var currFeature = event.data.popup.target.feature;
    var routeField = event.data.routeField;
    
    routeField.attr('coordinates', currFeature.latlng().join(', '));
    routeField.val(currFeature.addressText());
    //routeField.prop('readonly', true);
    PflegeMap.mapper.switchSearchTools({ "target" : $('#PflegeMap\\.routingSearchTool')[0]});
  },

  lookupNominatim: function(e){
    var scope = e.data,
        queryStr = e.target.value,
        url  = 'http://nominatim.openstreetmap.org/search';

    $.ajax({
      url: url,

      data: {
        viewboxlbrt    : '10.57,53.10,12.40,53.82',
        bounded        : 1,
        q              : queryStr,
        format         : 'json',
        addressdetails : 1,
      },

      // Work with the response
      success: function(response) {
        if (response.indexOf('Error') != -1 || response.indexOf('Fehler') != -1) {
          scope.showErrorMsg(scope, response);
        }
        else {
          scope.errMsgElement.innerHTML = '';
          scope.showNominatimResults(e, response);
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
      msg = 'Der Service zum Suchen von Adressen ist nicht erreichbar. Bitte prüfen Sie ob Sie eine Netzverbindung haben.';
    }
    e.errMsgElement.innerHTML = msg;
    $('#PflegeMap\\.Overlay').fadeIn(200,function(){
      $('#PflegeMap\\.MessageBox').animate({'top':'20px'},200);
    });
  },

  showNominatimResults: function(event, results) {
    $('#' + event.target.id.replace('.', '\\.') + 'AddressSearchResultBox').html(
      event.data.searchResultsFormatter(
        event,
        results
      )
    );
    $('#' + event.target.id.replace('.', '\\.') + 'AddressSearchResultBox').show();
  },

  searchResultsFormatter: function(event, results) {
    var html = '';
    if(typeof results != "undefined" && results != null && results.length > 0) {
      html = results.map(function(item) {
        return "<a href=\"#\" onclick=\"PflegeMap.router.setSearchResult('" + event.target.id + "', '" + item.display_name + "', " + item.lat + ", " + item.lon + ");\">" + item.display_name + '</a><br>';
      });
    }
    else {
      html = 'keine Treffer gefunden!'
    }
    return html;
  },

  durationFormatter: function(duration) {
    var hours = Math.floor(duration),
      minutes = Math.round((duration - hours) * 60),
      textParts = [];
    if (hours > 0)
      textParts.push(hours + ' Std.');
    if (minutes > 0)
      textParts.push(minutes + ' Min.');
    return textParts.join(' ');
  },

  distanceFormatter: function(duration) {
    return (Math.round(duration * 100) / 100) + " km"
  },

  setSearchResult: function(target_id, display_name, lat, lon) {
    var target = '#' + target_id.replace('.', '\\.');
    $(target).val(display_name);
    $(target)[0].setAttribute('coordinates', lat + ', ' + lon);
    $(target + 'AddressSearchResultBox').hide();
  }
};