/**
 * Define a namespace for the application.
 */
window.PflegeMap = {
  // central setting for the projection of the map view
  viewProjection: 'EPSG:25833',
  // fuer einige Berechnungen muss nach LonLat transformiert werden
  baseProjection: 'EPSG:4326'
};
var PflegeMap = window.PflegeMap;

// load the data and the map after loading the map div
$('#PflegeMap').ready(function() {
  loadJSON(function(response) {
    PflegeMap.store = JSON.parse(response);
  });
  PflegeMap.map = PflegeMap.initMap(PflegeMap.store);
  PflegeMap.router = PflegeMap.initRouter();

  //instanciate the popup overlay
  var popupElem    = document.getElementById('PflegeMap.popup');
  var popupCloser  = document.getElementById('PflegeMap.popup-closer');
  var popupContent = document.getElementById('PflegeMap.popup-data');

  PflegeMap.popup = new ol.Overlay({
    element: popupElem,
    positioning: 'left-center',
    offset: [0,-8],
    stopEvent: false,
    autoPan: true,
    autoPanAnimation: {
      duration: 300
    },
    autoPanMargin: 30
  });
  PflegeMap.map.addOverlay(PflegeMap.popup);

  //display popup on click
  PflegeMap.map.on('click', function(evt) {
    var feature = PflegeMap.map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return feature;
        });
    if (feature) {
      // center des features ermitteln
      var featureCenter = ol.proj.fromLonLat(
        ol.extent.getCenter(
          ol.proj.transformExtent(
            feature.getGeometry().getExtent(),
            PflegeMap.viewProjection,PflegeMap.baseProjection
          )
        ),
        PflegeMap.viewProjection
      );
      console.log(evt.coordinate, featureCenter);
      PflegeMap.popup.setPosition(featureCenter);
//      PflegeMap.popup.setPosition(evt.coordinate);
      popupContent.innerHTML = 'Ballo';
    } else {
      PflegeMap.popup.setPosition(undefined);
    }
  });
});


/**
 * Function read the json data
 */
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', '/wfs2json/json/data.json', false); // true would load asynchronous
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

/**
 * Function initialise the map
 *
 */
PflegeMap.initMap = function(store) {

  var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    // comment the following two lines to have the mouse position
    // be placed within the map.
    //className: 'mouse-position',
    target: document.getElementById('PflegeMap.coordinates'),
    undefinedHTML: '&nbsp;'
  });

  var map = new ol.Map({
    target: 'PflegeMap.map',
    controls: ol.control.defaults().extend([
      new ol.control.ScaleLine(),
      mousePositionControl
    ]),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.TileImage({
          projection: PflegeMap.viewProjection,
          maxExtent: [100000, 5800000, 500000, 6075000],
          tileGrid: new ol.tilegrid.TileGrid({
            origin: [200000, 5880000],
            resolutions: [
              529.166666667, //0
              352.777777778, //1
              264.583333333, //2
              176.388888889, //3
              88.1944444444, //4
              52.9166666667,
              35.2777777778,
              28.2222222222,
              22.9305555556,
              17.6388888889,
              12.3472222222,
              8.8194444444,
              7.0555555556,
              5.2916666667,
              3.5277777778,
              2.6458333333,
              1.7638888889,
              0.8819444444,
              0.3527777778,
              0.1763888889
            ]
          }),
          tileUrlFunction: function(tileCoord) {
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            if (x < 0 || y < 0) {
              return '';
            }

            var url = 'http://geo.sv.rostock.de/geodienste/stadtplan/tms/1.0.0/stadtplan/EPSG25833/'
                      + z + '/' + x + '/' + y + '.png';

            //console.log(url);
            return url;
          }
        })
      })
    ],
    view: new ol.View({
      maxExtent: [205000, 5880000, 325000, 5968000],
      maxResolution: 176.388888889,
      minResolution: 0.1763888889,
      center: ol.proj.transform([11.7, 53.4], PflegeMap.baseProjection, PflegeMap.viewProjection),
      zoom: 0
    })
  });
  
  // die map view im Pflegemap Namespace bereitstellen
  PflegeMap.view = map.getView();
  
  // Pflegeeinrichtungen vom store lesen und in einen Vektorlayer projizieren
  var features = [];
  for (var i = 0; i < store.length; i++){
    var feature = new PflegeMap.angebot(store[i]);
    features.push(feature);
  }
  var vektorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: features
    })
  });
  
  // Vektorlayer zur Karte hinzufügen
  vektorLayer.setMap(map);
  
  function zeigeEinrichtungen(store, layer){    
    var features = [];
    for (var i = 0; i < store.length; i++){
      var feature = new PflegeMap.angebot(store[i]);
      features.push(feature);
    }
    layer.setSource(new ol.source.Vector({
      features: features
    }));
    
    // Vektorlayer zur Karte hinzufügen
    vektorLayer.setMap(map);
  };
  
//    zeigeEinrichtungen(store, map);
  
  // Handler für Kategorie-Checkboxen
  $(".cb-kat").change(function(event){
    if (event.target.checked){
      // alle Kategorien gewählt?
      var allChecked = true;
      $(".cb-kat").each(function(){if (!this.checked) allChecked = false;});
      if (allChecked) $("#cb-all-kat")[0].checked = true;
    }
    else {
      // un-check alle Kategorien
      if ($("#cb-all-kat").val() == 'on') {
        $("#cb-all-kat")[0].checked = false;
      }
    }
    // refresh display
    var einrichtungen = [];
    $(".cb-kat").each(function(){
      if (this.checked) {
        var cb = this;
        var filterAntwort = store.filter(function(elem){
          return elem.kategorie == cb.getAttribute('kategorie');
        }, cb);
        einrichtungen = einrichtungen.concat(filterAntwort);
      }
    });
    zeigeEinrichtungen(einrichtungen, vektorLayer);
  });
  // Handler für "alle Kategorien"
  $("#cb-all-kat").change(function(event){
    if (event.target.checked){
      $(".cb-kat").each(function(){this.checked = true;});
      zeigeEinrichtungen(store, vektorLayer);
    } else {
      $(".cb-kat").each(function(){this.checked = false;});
      zeigeEinrichtungen([], vektorLayer);
    }
  });

  function lookupPhoton(queryStr, successFn, errorFn, scope){
    successFn = successFn || function() {};
    errorFn   = errorFn   || function() {};
    scope     = scope     || this;
    
    var jqxhr = $.ajax( "http://photon.komoot.de/api",{
      data: {
        q              : queryStr,
        lat            : 53.326342,
        lon            : 11.5,
        limit          : 5,
        lang           : 'de',
      }
    })
    .done(function(response) {
      successFn.apply(scope,["success", response]);
    })
    .fail(function() {
      errorFn.apply(scope, ["error"] );
    });
  };
  
  
  function lookupNominatim(queryStr, successFn, errorFn, scope){
    successFn = successFn || function() {};
    errorFn   = errorFn   || function() {};
    scope     = scope     || this;
    
    var jqxhr = $.ajax( "http://nominatim.openstreetmap.org/search",{
      data: {
        viewboxlbrt    : '10.57,53.10,12.40,53.82',
        bounded        : 1,
        q              : queryStr,
        format         : 'json',
        addressdetails : 1,
      }
    })
    .done(function(response) {
      successFn.apply(scope,["success", response]);
    })
    .fail(function() {
      errorFn.apply(scope, ["error"] );
    });
  };
  
  // Handler für search Feld
  // Mit jeder Tasteneingabe wird ein Timer gestartet,
  // der nach <delay> Millisekunden die Verarbeitung der
  // Eingaben startet. Sobald innerhalb des Delays eine
  // weitere Eingabe erfolgt, wird der Timer von neuem
  // gestartet.
  var delay = 1200;
  var timeOutHandle;
  
  $("#search").on('input_', function(event){
    window.clearTimeout(timeOutHandle);
    var queryStr = event.target.value;
    
    // erst ab einer Eingabelänge von 3 Zeichen
    if (queryStr.length < 3) return;
    
    timeOutHandle = window.setTimeout(function(){
//        lookupPhoton(queryStr, function success(arg,response){
      lookupNominatim(queryStr, function success(arg,response){
        PflegeMap.showNominatimResults(response);
      }, function error(arg){
        console.log(arg);
      });
    }, delay);
  });
  
  $("#search").on('change', function(event){
    window.clearTimeout(timeOutHandle);
    var queryStr = event.target.value;
//        lookupPhoton(queryStr, function success(arg,response){
    lookupNominatim(
      queryStr,
      function success(arg, response) {
        PflegeMap.showNominatimResults(response);
      },
      function error(arg){
        console.log(arg);
      }
    );
  });
  return map;
};

PflegeMap.initRouter = function() {
  var router = PflegeMap.routerController;
  router.setEventHandler();
  router.initLayer();
  return router;
}

PflegeMap.showNominatimResults = function(results) {
  var displayNamesArray = results.map(function(item){
    return item.display_name;
  });
  console.log(displayNamesArray);
  $('#search_result').html(PflegeMap.searchResultsFormatter(results));
};


PflegeMap.searchResultsFormatter = function(results) {
  return results.map(function(item) {
    return "<a href=\"#\" onclick=\"PflegeMap.addFeature(new PflegeMap.searchResult('" + item.display_name + "', " + item.lat + ", " + item.lon + "));\">" + item.display_name + '</a><br>';
  });
};

PflegeMap.addFeature = function(feature) {
  var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [feature]
        })
      }),
      extent = feature.getGeometry().getExtent();
  vectorLayer.setMap(PflegeMap.map);
  PflegeMap.map.getView().fit(ol.extent.buffer(extent, 300), PflegeMap.map.getSize());
  console.log(ol.extent.buffer(extent, 300));
}
