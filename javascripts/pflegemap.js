  // central setting for the projection of the map view
  PflegeMap.viewProjection = PflegeMap.config.viewProjection,
  // fuer einige Berechnungen muss nach LonLat transformiert werden
  PflegeMap.baseProjection = PflegeMap.config.baseProjection;

// load the data and the map after loading the map div
$('#PflegeMap').ready(function() {
  loadJSON(PflegeMap.config.storeUrl, function(response) {
    PflegeMap.store = JSON.parse(response);
  });

  /*
   * init map and controller
   * order is important! initMap first
  */
  {
    PflegeMap.searchTools = [];
    PflegeMap.map = PflegeMap.initMap(PflegeMap.store);
    loadJSON(PflegeMap.config.indexUrl, function(response) {
      PflegeMap.suchIndex = JSON.parse(response);
      $.each(PflegeMap.suchIndex, function(value, key){
        $('#PflegeMap\\.searchWords').append('<option>' + value + '</option>')
      });
    });

    PflegeMap.popup = PflegeMap.initPopup();
    PflegeMap.mapper = PflegeMap.initMapper(PflegeMap.map, PflegeMap.store);
    PflegeMap.router = PflegeMap.initRouter();
    PflegeMap.geocoder = PflegeMap.initGeocoder();
    PflegeMap.proximiter = PflegeMap.initProximiter();
    PflegeMap.reacher = PflegeMap.initReacher();
    PflegeMap.helper = PflegeMap.initHelper();
  }

  //display popup on click
  PflegeMap.map.on('click', function(evt) {
    var target = PflegeMap.map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return {
            feature: feature,
            layer: layer
          };
        });
    if (target) {
      if (PflegeMap.mapper.selectedFeature)
        PflegeMap.mapper.selectedFeature.unselect();
      PflegeMap.popup.target = target;
      target.feature.select();
    } else {
      //console.log('In Karte geklickt, kein Feature getroffen. Altes target %o', PflegeMap.popup.target);
      // hide popup
      if (PflegeMap.mapper.selectedFeature)
        PflegeMap.mapper.selectedFeature.unselect();
    }
  });
});

/**
 * Function read the json data
 */
function loadJSON(source, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', source, false); // true would load asynchronous
  //xobj.open('GET', '/wfs2json/json/data.json', false); // true would load asynchronous
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
  PflegeMap.maxExtent = PflegeMap.view.calculateExtent(map.getSize());

  // close the popup on map zoom and pan actions
  function closePopup(){
    if (PflegeMap.popup.feature)
      PflegeMap.popup.feature.unselect();
  };
  PflegeMap.view.on('change:resolution', closePopup);
  //PflegeMap.view.on('change:center', closePopup);
  
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

  return map;
};

PflegeMap.initPopup = function(){
  //instanciate the popup overlay
  var popupElem    = document.getElementById('PflegeMap.popup');
  var popupCloser  = document.getElementById('PflegeMap.popup-closer');

  /**
   * Add a click handler to hide the popup.
   * @return {boolean} Don't follow the href.
   */
  popupCloser.onclick = function() {
    PflegeMap.popup.feature.unselect();
    popupCloser.blur();
    return false;
  };

  var popup = new ol.Overlay({
    element: popupElem,
    offset: [0,-8],
    stopEvent: true,
    autoPan: true,
    autoPanAnimation: {
      duration: 300
    },
    autoPanMargin: 30,
  });
  
  PflegeMap.map.addOverlay(popup);

  return popup;
};

PflegeMap.initMapper = function(map, store) {
  var mapper = new PflegeMap.mapperController(map);
  mapper.initSearchTools();
  mapper.initLayer(store);
  mapper.initList(store);
  mapper.setEventHandlers();
  return mapper;
};

PflegeMap.initRouter = function() {
  var router = PflegeMap.routerController;
  router.initSearchTool();
  router.setEventHandler();
  router.initLayer();
  return router;
};

PflegeMap.initGeocoder = function() {
  var geocoder = PflegeMap.geocoderController;
  geocoder.initSearchTool();
  geocoder.initLayer();
  geocoder.setEventHandler();
  return geocoder;
};

PflegeMap.initProximiter = function() {
  var proximiter = PflegeMap.proximiterController;
  proximiter.initSearchTool();
  proximiter.setEventHandler();
  return proximiter;
};

PflegeMap.initReacher = function() {
  var reacher = PflegeMap.reacherController;
  reacher.initSearchTool();
  reacher.initLayer();
  reacher.setEventHandler();
  return reacher;
};

PflegeMap.initHelper = function() {
  var helper = PflegeMap.helpController;
  helper.initHelp();
  helper.setEventHandler();
  return helper;
}