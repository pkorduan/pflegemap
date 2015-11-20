PflegeMap.angebot = function(params) {
  var feature = new ol.Feature({
    id: params.id,
    type: 'Angebot',
    angebot: params.angebot,
    name: params.name,
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
    kapazitaet: params.kapazitaet,
    hidden: false
  });

  feature.listElement = function() {
    html  = '<div id="PflegeMap.careService_' + this.get('id') + '" class="pflegemap-care-service">';
    html += '  <b>' + this.get('name') + '</b><br>';
    html += '  ' + this.get('plz') + ' ' + this.get('gemeinde') + ', ' + this.get('strasse') + ' ' + this.get('hnr') + '<br>';
    html += '  Einrichtung: ' + this.get('einrichtung') + '<br>';
    html += '  Träger: ' + this.get('traeger') + '<br>';
    html += '  Ansprechpartner: ' + this.get('ansprechpartner') + ' Telefon: ' + this.get('telefon') + '<br>';
    html += '  Kapazität: ' + this.get('kapazität') + '<br>';
    html += '  <span class="pflegemap-care-service-close"></span>';
    html += '</div>';
    return $(html);
  }

  style = function(resolution) {
    if (this.get('hidden')) {
      return null;
    }
    else {
      return [ new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
//        anchorYUnits: 'pixels',
          anchorYUnits: 'fraction',
          opacity: 0.95,
          src: 'images/' + params.kategorie +  '.png'
        })
      })];
    }
  };

  feature.setStyle(style);
  
  return feature;
}