PflegeMap.geocoderController = {
  scope: this,

  name: "geocoderController",

  layer: new ol.layer.Vector({
    opacity: 1,
    source: new ol.source.Vector({
      features: []
    }),
    zIndex: 100
  }),

  initLayer: function() {
    this.layer.setMap(PflegeMap.map);
    this.errMsgElement = $('#PflegeMap\\.errorMessage')[0];
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
        layer: this.layer,
        scope: this
      },
      function(event){
        event.data.scope.removeSearchResultFeatures(event.data.scope);
        event.data.popup.setPosition(undefined);
/*
        debug_e=event;
        var layer = event.data.layer,
          popup = event.data.popup,
          feature = popup.target.feature;
        
        popup.setPosition(undefined);
        layer.getSource().removeFeature(feature);
*/
      }
    );
  },

  lookupNominatim: function(e){
    var scope = PflegeMap.geocoder,
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

      beforeSend: PflegeMap.mapper.searchAnimation.show,

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
      },
      
      complete:  PflegeMap.mapper.searchAnimation.hide
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

    $('#' + event.target.id.replace('.', '\\.') + 'ResultBox').html(
      this.searchResultsFormatter(
        event,
        results
      )
    );
    $('#' + event.target.id.replace('.', '\\.') + 'ResultBox').show();
  },

  searchResultsFormatter: function(event, results) {
    var html = '';

    if(typeof results != "undefined" && results != null && results.length > 0) {
      html = results.map(function(item) {
        item.display_name = PflegeMap.geocoder.displayNameFormatter(item);
        return "<a href=\"#\" onclick=\"" + event.data.getSearchResultCallback(event, item) + "\">" + item.display_name + '</a><br>';
      });
    }
    else {
      html = 'keine Treffer gefunden!'
    }
    return html;
  },

  displayNameFormatter: function(item) {
    return item.display_name;
  },

  getSearchResultCallback: function(event, item) {
    return "PflegeMap.geocoder.addSearchResultFeature('addressSearchField', '" + item.display_name + "', " + item.lat + ", " + item.lon + ")";
  },

  addSearchResultFeature: function(search_field, display_name, lat, lon) {

    var searchResultFeature = new PflegeMap.searchResult(display_name, lat, lon),
        source = this.layer.getSource(),
        target = $('#PflegeMap\\.' + search_field);

    target.val(display_name);
    target[0].setAttribute('coordinates', lat + ', ' + lon);
    $('#PflegeMap\\.' + search_field + 'ResultBox').hide();
    
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

  removeSearchResultFeatures : function(scope){
    var source = scope.layer.getSource(),
        features = source.getFeatures();

    if (features != null && features.length > 0) {
      for (x in features) {
        source.removeFeature( features[x] );
      }
    }
  }
};