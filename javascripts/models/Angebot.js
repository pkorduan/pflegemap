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
    html += '  ' + this.get('plz') + ' ' + this.get('gemeinde') + ', ' + this.get('strasse') + ' ' + this.get('hnr');
    html += '  <span class="pflegemap-care-service-close"></span>';
    html += '</div>';
    return $(html);
  };
  
  feature.preparePopup = function() {
    PflegeMap.popup.get('element').className = 'pm-popup pm-angebot';
    PflegeMap.popup.get('contentDiv').innerHTML = this.get('angebot')+'<br/>'
        +this.get('name')+'<br/>'
        +this.get('gemeinde')+'<br/>'
        +this.get('strasse')+' '
        +this.get('hnr');
  };

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