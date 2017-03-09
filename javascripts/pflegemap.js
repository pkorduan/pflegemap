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
    PflegeMap.proximiter = PflegeMap.initProximiter(PflegeMap.map);
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

    if (target && target.feature.get('type')) {
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
  $( "input[versart='Ambulante Pflege']" ).trigger('click').prop('checked', true);
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
  
  // create the ORKA-Map Layer
  PflegeMap.tileLayer = new ol.layer.Tile({
    source: new ol.source.TileImage({
			attributions: [
				new ol.Attribution({
					html: 'Kartenbild &copy; <a href="https://www.orka-mv.de/datenschutz.html" target="_blank">Hansestadt Rostock</a> (CC BY 4.0) | Kartendaten &copy; <a href="http://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> (ODbL) und LkKfS-MV'
				}),
				new ol.Attribution({
					html: '<br><a href="https://nordost.aok.de" target="_blank">AOK Nordost - Die Gesundheitskasse</a>'
				}),
				new ol.Attribution({
					html: '<br><a href="http://www.kvmv.info/patienten/40/index.html" target="_blank">Kassenärztliche Vereinigung Mecklenburg-Vorpommern</a>'
				}),
				new ol.Attribution({
					html: '<br><a href="http://www.lagus.mv-regierung.de" target="_blank">Landesamt für Gesundheit und Soziales Mecklenburg-Vorpommern</a>'
				}),
				new ol.Attribution({
					html: '<br>Sonstige Daten <a href="http://www.kreis-lup.de" target="_blank">Landkreis Ludwigslust-Parchim</a>'
				}),
			],
      projection: PflegeMap.viewProjection,
      tileGrid: new ol.tilegrid.TileGrid({
      origin: [-464849.38, 5057815.86858],
      resolutions: [4891.96981025128, 3459.1450261886484, 2445.9849051256397,
                              1729.5725130942737,1222.9924525628198, 864.7862565471368,
                              611.4962262814098, 432.3931282735683, 305.7481131407049,
                              216.19656413678416, 152.8740565703524, 108.09828206839207,
                              76.43702828517618, 54.049141034196026, 38.21851414258809,
                              27.024570517098006, 19.109257071294042, 13.512285258549001,
                              9.55462853564702, 6.7561426292745, 4.77731426782351,
                              3.3780713146372494, 2.3886571339117544, 1.6890356573186245,
                              1.1943285669558772, 0.8445178286593122, 0.5971642834779384,
                              0.422258914329656, 0.29858214173896913, 0.21112945716482798,
                              0.14929107086948457, 0.10556472858241398, 0.07464553543474227,
                              0.05278236429120697, 0.03732276771737113]
      }),
      tileUrlFunction: function(tileCoord) {
        var z = tileCoord[0];
        var x = tileCoord[1];
        var y = tileCoord[2];

        if (x < 0 || y < 0) {
          return '';
        }

        var url = 'http://www.orka-mv.de/geodienste/orkamv/tms/1.0.0/orkamv/epsg_25833/'
                  + z + '/' + x + '/' + y + '.png';

        //console.log(url);
        return url;
      }
    }),
    // user data
    layerExtent: [200000, 5889000, 335000, 5967000]
  });

/*
  PflegeMap.selectClick = new ol.interaction.Select({
    condition: ol.events.condition.click,
    style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 0.95,
          src: 'images/sonstiges.png'
        })
      })
  });
*/

  function constrainMapToExtend(map,extent){
    var mapView = map.getView(),
      viewExtent = mapView.calculateExtent(map.getSize()),
      halfWidth = ol.extent.getWidth(viewExtent) / 2.0,
      halfHeight= ol.extent.getHeight(viewExtent) / 2.0,
      newCenterConstraint = [extent[0] + halfWidth, extent[1] + halfHeight, extent[2] - halfWidth, extent[3] - halfHeight];
    mapView.constraints_.center = ol.View.createCenterConstraint_({extent:newCenterConstraint});
    mapView.setCenter(mapView.constrainCenter(mapView.getCenter()));
  };

  var map = new ol.Map({
    target: 'PflegeMap.map',
    controls: ol.control.defaults().extend([
      new ol.control.ScaleLine(),
      mousePositionControl
    ]),
    layers: [
      PflegeMap.tileLayer
    ],
    view: new ol.View({
      maxResolution: 152.8740565703524,
      minResolution: 0.14929107086948457,
      center: ol.proj.transform([11.55, 53.455], PflegeMap.baseProjection, PflegeMap.viewProjection),
      zoom: 0
    }),
    logo: false
  });

/*
  map.addInteraction(PflegeMap.selectClick);
  PflegeMap.selectClick.on('select', function(e) {
    console.log('geclicked on %o', e.target.getFeatures());
  })
*/

  // die map view im Pflegemap Namespace bereitstellen
  PflegeMap.view = map.getView();
  
  // den Center Constraint an die Zoom-Stufe anpassen ...
  // ... initial ...
  constrainMapToExtend(map, PflegeMap.tileLayer.get('layerExtent'));
  // ... für jeden Zoom-Vorgang
  PflegeMap.view.on('change:resolution', function(event){
    constrainMapToExtend(map, PflegeMap.tileLayer.get('layerExtent'));
  });
  
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
    offset: [0,-18],
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

PflegeMap.initProximiter = function(map) {
  var proximiter = PflegeMap.proximiterController(map);
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
