PflegeMap.geocoderController = {
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
    this.searchResultBox = $('#PflegeMap\\.searchResultBox')[0];
  },

  initSearchTool: function() {
    PflegeMap.searchTools.push('addressSearch');
  },

  setEventHandler: function() {
    $('#PflegeMap\\.addressSearchTool').on(
      'click',
      this,
      PflegeMap.mapper.switchSearchTools
    );

    $('#PflegeMap\\.addressSearchField').on(
      'change',
      this,
      this.lookupNominatim
    );

    $('#PflegeMap\\.popup .pm-popup-function-clear').off();
    $('#PflegeMap\\.popup .pm-popup-function-clear').on(
      'click',
      {
        popup: PflegeMap.popup,
        layer: this.layer
      },
      function(event){
        var layer = event.data.layer,
          popup = event.data.popup,
          feature = popup.feature;
        popup.setPosition(undefined);
        layer.getSource().removeFeature(feature);
      }
    );
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
          scope.showNominatimResults(scope, response);
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

  showNominatimResults: function(scope, results) {
    $('#PflegeMap\\.addressSearchResultBox').html(scope.searchResultsFormatter(results));
    $('#PflegeMap\\.addressSearchResultBox').show();
  },

  searchResultsFormatter: function(results) {
    return results.map(function(item) {
      return "<a href=\"#\" onclick=\"PflegeMap.geocoder.addSearchResultFeature('" + item.display_name + "', " + item.lat + ", " + item.lon + ");\">" + item.display_name + '</a><br>';
    });
  },

  addSearchResultFeature: function(display_name, lat, lon) {
    var searchResultFeature = new PflegeMap.searchResult(display_name, lat, lon),
        source = this.layer.getSource();

    $('#PflegeMap\\.searchResultBox').hide();
    
    this.removeSearchResultFeatures(this);

    source.addFeature( searchResultFeature );

    PflegeMap.map.getView().fit(
      ol.extent.buffer(
        searchResultFeature.getGeometry().getExtent(),
        300
      ),
      PflegeMap.map.getSize()
    );
  },
  
  removeSearchResultFeatures : function(){
    var source = this.layer.getSource(),
    features = source.getFeatures();

    if (features != null && features.length > 0) {
      for (x in features) {
          source.removeFeature( features[x] );
      }
    }
  }
};