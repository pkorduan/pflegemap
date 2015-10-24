/**
 * Define a namespace for the application.
 */
window.PflegeMap = {};
var PflegeMap = window.PflegeMap;

// load the map after loading the map div
$('#PflegeMap.map').ready(function() {
  PflegeMap.initMap();
});

/**
 * Function initialise the map
 *
 */
PflegeMap.initMap = function() {

   // central setting for the projection of the map view
   PflegeMap.viewProjection = 'EPSG:25833';

   var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
//      projection: 'EPSG:3875',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    //className: 'mouse-position',
    target: document.getElementById('coordinates'),
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

            console.log(url);
            return url;
          }
        })
      })
    ],
    view: new ol.View({
      maxExtent: [205000, 5880000, 325000, 5968000],
      maxResolution: 176.388888889,
      minResolution: 0.1763888889,
      center: ol.proj.transform([11.5, 53.4], 'EPSG:4326', PflegeMap.viewProjection),
      zoom: 0
    })
  });
  
  // die styles für die verschiedenen Kategorien
  var katStyles = {
    ph: new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.95,
        src: 'images/PH.png'
      }))
    }),
    bw: new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.95,
        src: 'images/BW.png'
      }))
    }),
    tp: new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.95,
        src: 'images/TP.png'
      })),
    })
  };
  
  // Pflegeeinrichtungen vom store lesen und in einen Vektorlayer projizieren
  var features = [];
  for (var i = 0; i < store.length; i++){
    var inst = store[i];
    var feature = new ol.Feature(new ol.geom.Point(ol.proj.transform([inst.lon,inst.lat], 'EPSG:4326', PflegeMap.viewProjection)));
    feature.setStyle(katStyles[inst.kategorie]);
    features.push(feature);
  }
  var vektorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: features
    })
  });
  
  // Vektorlayer zur Karte hinzufügen
  vektorLayer.setMap(map);
  
  function zeigeEinrichtungen(store, katStyles, layer){
    var features = [];
    for (var i = 0; i < store.length; i++){
      var inst = store[i];
      var feature = new ol.Feature(new ol.geom.Point(ol.proj.transform([inst.lon,inst.lat], 'EPSG:4326', PflegeMap.viewProjection)));
      feature.setStyle(katStyles[inst.kategorie]);
      features.push(feature);
    }
    layer.setSource(new ol.source.Vector({
      features: features
    }));
    
    // Vektorlayer zur Karte hinzufügen
    vektorLayer.setMap(map);
  };
  
//    zeigeEinrichtungen(store, katStyles, map);
  
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
    zeigeEinrichtungen(einrichtungen, katStyles, vektorLayer);
  });
  // Handler für "alle Kategorien"
  $("#cb-all-kat").change(function(event){
    if (event.target.checked){
      $(".cb-kat").each(function(){this.checked = true;});
      zeigeEinrichtungen(store, katStyles, vektorLayer);
    } else {
      $(".cb-kat").each(function(){this.checked = false;});
      zeigeEinrichtungen([], katStyles, vektorLayer);
    }
  })
}