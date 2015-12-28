PflegeMap.angebot = function(params) {
  var feature = new ol.Feature({
    id: params.id,
    type: 'Angebot',
    angebot: params.angebot,
    name: params.name,
    kategorie: params.kategorie,
    geometry: new ol.geom.Point([Number(params.x), Number(params.y)]),
    einrichtung: params.einrichtung,
    strasse: params.strasse,
    hnr: params.hnr,
    plz: params.plz,
    gemeinde: params.gemeinde,
    traeger: params.traeger,
    ansprechpartner: params.ansprechpartner,
    telefon: params.telefon,
    email: params.email,
    internet: params.internet,
    kapazitaet: params.kapazitaet,
    hidden: false
  }),

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

  feature.listElement = function() {
    html  = '<div id="PflegeMap.careService_' + this.get('id') + '" class="pflegemap-care-service">';
    html += '  <div class="pflegemap-care-service-content">';
    html += '    <b>' + this.get('angebot') + '</b><br>';
    html += '    Name: ' + this.get('name') + '<br>';
    html += '    Adresse: ' + this.address() + '<br>';
    html += '    Einrichtung: ' + this.get('einrichtung') + '<br>';
    if (this.get('traeger') != '')
      html += '  Träger: ' + this.get('traeger') + '<br>';
    if (this.get('ansprechpartner') != '')
      html += '  Ansprechpartner: ' + this.get('ansprechpartner') + '<br>';
    if (this.get('telefon') != '')
      html += '   Telefon: ' + this.get('telefon') + '<br>';
    if (this.get('email') != undefined && this.get('email') != '')
      html += '   E-Mail: <a href="mailto:' + this.get('email') + '">' + this.get('email') + '</a><br>';
    if (this.get('internet') != undefined && this.get('internet') != '') {
      var url = (!/http/i.test(this.get('internet'))) ? url = 'http://' + this.get('internet') : this.get('internet');
      html += '   Internet: <a href="' + url + '" target="_blank">' + this.get('internet') + '</a><br>';
    }
    if (this.get('kapazitaet') != undefined)
      html += '    Kapazität: ' + this.get('kapazitaet') + '<br>';
    html += '  </div>';
    html += '<a onclick="alert(\'Funktion noch nicht implementiert\');"><i class="fa fa-flag-o fa-fw"></i> Route von hier</a><br>';
    html += '<a onclick="alert(\'Funktion noch nicht implementiert\');"><i class="fa fa-flag-checkered fa-fw"></i> Route nach hier</a>';
    html += '  <span class="pflegemap-care-service-close"></span>';
    html += '</div>';
    html += '<div class="pflegemap-clear"></div>';
    return $(html);
  };

  feature.title = function() {
    return this.get('name');
  };

  feature.data = function() {
    var html = this.get('ansprechpartner');
    html += '<br>' + this.get('plz') + ' ' + this.get('gemeinde');
    html += '<br>' + this.get('strasse') + ' ' + this.get('hnr');
    if (this.get('kapazitaet') != undefined && this.get('kapazitaet') > 0)
      html += '<br>Kapazität: ' + this.get('kapazitaet');
    return html;
  };
  
  feature.address = function() {
    return this.get('plz') + ' ' + this.get('gemeinde') + ', ' + this.get('strasse') + ' ' + this.get('hnr');
  };
  
  feature.xy = function() {
    var xy = this.getGeometry().getCoordinates();
    return xy[0] + ', ' + xy[1];
  };

  feature.latlng = function() {
    var lnglat = ol.proj.transform(this.getGeometry().getCoordinates(), PflegeMap.viewProjection, PflegeMap.baseProjection);
    return [lnglat[1], lnglat[0]];
  };

  feature.preparePopup = function() {
    PflegeMap.popup.feature = this;
    $('#PflegeMap\\.popup').attr('class','pm-popup pm-angebot');
    $('#PflegeMap\\.popup-title').html(this.title());
    $('#PflegeMap\\.popup-data').html(this.data());
  };
  
  return feature;
};