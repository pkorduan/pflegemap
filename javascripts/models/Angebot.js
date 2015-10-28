PflegeMap.angebot = function(params) {
  var feature = new ol.Feature({
    id: params.id,
    type: 'Angebot',
    kategorie: params.kategorie,
    geometry: new ol.geom.Point([params.x, params.y]),
    einrichtung: params.einrichtung,
    strasse: params.strasse,
    hnr: params.hnr,
    plz: params.plz,
    gemeinde: params.gemeinde,
    traeger: params.traeger,
    ansprechpartner: params.ansprechpartner,
    telefon: params.telefon,
    kapazitaet: params.kapazitaet
  });
  
  style = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      opacity: 0.95,
      src: 'images/' + params.kategorie +  '.png'
    }))
  });
  feature.setStyle(style);
  
  return feature;
}