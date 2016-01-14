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
    besonderheit: params.besonderheit,
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
    html += '  <div class="pm-content">';
    html += '    <div>';
    html += '      <b>' + this.get('einrichtung') + '</b><br>';
    html += '<i>Kategorie:</i> ' + this.get('angebot');
    if (this.get('traeger') != '')
      html += ', <i>Träger:</i> ' + this.get('traeger') + '<br>';
    html += '    </div>';
    html += '    <div class="pm-box">';
    if (this.get('ansprechpartner') != '')
      html += this.get('ansprechpartner') + '<br>';
    if (this.get('strasse') != '')
      html += this.get('strasse') + ' ' + this.get('hnr') + '<br>';
    if (this.get('plz') != '')
      html += this.get('plz') + ' ' + this.get('gemeinde');
    html += '    </div>';
    html += '    <div class="pm-box">';
    if (this.get('telefon') != '')
      html += this.get('telefon') + '<br>';
    if (this.get('email') != undefined && this.get('email') != '')
      html += '<a href="mailto:' + this.get('email') + '">' + this.get('email') + '</a><br>';
    if (this.get('internet') != undefined && this.get('internet') != '') {
      var url = (!/http/i.test(this.get('internet'))) ? url = 'http://' + this.get('internet') : this.get('internet');
      html += '<a href="' + url + '" target="_blank">' + this.get('internet') + '</a><br>';
    }
    html += '    </div>';
    html += '    <div class="pm-box">';
    if (this.get('kapazitaet') != '')
      html += '     <i>Kapazität:</i> ' + this.get('kapazitaet') + '<br>';
    if (this.get('besonderheit') != '')
      html += '     <i>Besonderheit:</i> ' + this.get('besonderheit') + '<br>';
    html += '    </div>';
    html += '  </div>'
    html += '  <div>';
    html += '    <!--span class="pm-care-service-close"></span><br//-->';
    html += '    <a onclick="alert(\'Funktion noch nicht implementiert\');"><i class="fa fa-flag-o fa-fw"></i> Route von hier</a><br>';
    html += '    <a onclick="alert(\'Funktion noch nicht implementiert\');"><i class="fa fa-flag-checkered fa-fw"></i> Route nach hier</a>';
    html += '  </div>';
    html += '</div>';
    html += '<div class="pflegemap-clear"></div>';
    return $(html);
  };

  feature.title = function() {
    return this.get('einrichtung');
  };

  feature.data = function() {
    var html = this.get('ansprechpartner');
    html += '<br>' + this.get('strasse') + ' ' + this.get('hnr');
    html += '<br>' + this.get('plz') + ' ' + this.get('gemeinde');
    if (this.get('telefon') != '')
      html += '<br>Tel: ' + this.get('telefon');
    return html;
  };
  
  feature.address = function() {
    return (this.get('strasse') + ' ' + this.get('hnr') + '<br>' + this.get('plz') + ' ' + this.get('gemeinde')).trim();
    //return (this.get('plz') + ' ' + this.get('gemeinde') + ', ' + this.get('strasse') + ' ' + this.get('hnr')).trim();
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