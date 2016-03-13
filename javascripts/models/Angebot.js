PflegeMap.angebot = function(params) {
  var feature = new ol.Feature({
    id: params.id,
    type: 'Angebot',
    angebot: params.angebot,
    name: params.name,
    kategorie: params.kategorie,
    versorgungsart: params.versorgungsart,
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
    hidden: true,
    selected: false,
    icon: (function(){
      switch (params.versorgungsart){
        case 'Ambulante Pflege':
          return 'AmbulantePflege';
        case 'Gesundheit':
          return 'Gesundheit';
        case 'Stationäre Pflege':
          return 'StationPflege';
        case 'Sterbebegleitung':
          return 'Sterbebegleitung';
        case 'Teilstationäre Pflege':
          return 'TeilstationPflege';
        case 'Wohnen':
          return 'Wohnen';
        default:
          return 'Sonstige';
      }
    })()
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
          anchorYUnits: 'fraction',
          opacity: 0.95,
          src: 'images/' + this.get('icon') +  '.png'
        })
      })];
    }
  };

  feature.setStyle(style);

  feature.getListElement = function() {
    html  = '<div id="PflegeMap.careService_' + this.get('id') + '" class="pm-care-service" feature_id="' + this.get('id') + '" class="row list small-map medium-map large-map">';

      html += '<div class="pm-care-service-content small-100 medium-80 large-45 columns">';
        html += '<a name="PflegeMap.careService_' + this.get('id') + '"></a><b>' + this.get('name') + '</b><br>';
        html += '<i>Versorgungsart:</i> ' + this.get('versorgungsart') + '<br>';
        html += '<i>Kategorie:</i> ' + this.get('angebot');
      if (this.get('traeger') != '')
        html += '<br><i>Träger:</i> ' + this.get('traeger');
      if (this.get('kapazitaet') != '' && this.get('kapazitaet') > 1)
        html += '<br><i>Kapazität:</i> ' + this.get('kapazitaet');
      if (this.get('besonderheit') != '')
        html += '<br>' + this.get('besonderheit');
      html += '</div>';

      html += '<div class="small-100 medium-80 large-40 columns">';
        html += this.contact();
      html += '</div>';

      html += '<div class="pm-list-functions small-100 medium-20 large-15 columns push">';
        html += '<div class="pm-list-function-from"><i class="fa fa-flag-o fa-fw "></i> Route von hier</div>';
        html += '<div class="pm-list-function-to"><i class="fa fa-flag-checkered fa-fw"></i> Route nach hier</div>';
        html += '<a href="#PflegeMap.top"><i class="fa fa-map-marker fa-fw"></i> zur Karte</a>';
      html += '</div>';
    html += '</div>';
    html += '<div class="pflegemap-clear"></div>';
    this.listElement = $(html);
    return this.listElement;
  };

  feature.title = function() {
    return this.get('einrichtung');
  };

  feature.data = function() {
    var html = '';
    if (this.get('ansprechpartner') != '')
      html += this.get('ansprechpartner') + '<br>';
    html += this.address();
    if (this.get('telefon') != '')
      html += '<br>Tel: ' + this.get('telefon');
    html += '<a href="#PflegeMap.careService_' + this.get('id') + '" style="float: right">Details</a>';
    return html;
  };
  
  feature.address = function() {
    return (this.get('strasse') + ' ' + this.get('hnr') + '<br>' + this.get('plz') + ' ' + this.get('gemeinde')).trim();
    //return (this.get('plz') + ' ' + this.get('gemeinde') + ', ' + this.get('strasse') + ' ' + this.get('hnr')).trim();
  };

  feature.contact = function() {
    var contactData = [];
    if (this.get('ansprechpartner') != '') contactData.push(this.get('ansprechpartner'));
    contactData.push(this.address());
    if (this.get('telefon') != '') contactData.push(this.get('telefon'));
    if (this.get('email') != undefined && this.get('email') != '')
      contactData.push('<a href="mailto:' + this.get('email') + '">' + this.get('email') + '</a>');
    if (this.get('internet') != undefined && this.get('internet') != '') {
      var url = (!/http/i.test(this.get('internet'))) ? url = 'http://' + this.get('internet') : this.get('internet');
      contactData.push('<a href="' + url + '" target="_blank">' + this.get('internet') + '</a>');
    }
    return contactData.join('</br>');
  }

  feature.addressText = function() {
    return (this.get('strasse') + ' ' + this.get('hnr') + ', ' + this.get('plz') + ' ' + this.get('gemeinde')).trim();
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
  
  feature.show = function() {
    this.set('hidden', false);
    this.listElement.show();
    this.changed();
  };
  
  feature.hide = function() {
    if (this.get('selected'))
      this.unselect();
    this.set('hidden', true);
    this.listElement.hide();
    this.changed();
  };
  
  feature.unselect = function() {
    if (this.get('selected')) {
      //console.log('Unselect angebot feature: ' + this.get('id'));
      // close Popup
      PflegeMap.popup.setPosition(undefined);
      // remove highlighting from list Element
      this.listElement.toggleClass('pm-care-service-highlighted');
      // set this feature to unselected
      this.set('selected', false);
    }
  };

  feature.select = function() {
    if (!this.get('selected')) {
      //console.log('Select angeobt feature: ' + this.get('id'));

      // show popup
      //console.log('show popup');
      this.preparePopup();
      PflegeMap.popup.setPosition(
        this.getGeometry().getCoordinates()
      );

      // highlight the list Element
      //console.log('highlight list element');
      this.listElement.toggleClass('pm-care-service-highlighted');

      // set this feature to selected
      this.set('selected', true);
      PflegeMap.mapper.selectedFeature = this;
    }
  };

  feature.toggle = function() {
    //console.log('toggle angebot feature id: ' + this.get('id'));
    if (this.get('selected')) {
      //console.log('this feature id: ' + this.get('id') + ' is selected, unselect it.');
      this.unselect();
    }
    else {
      //console.log('feature id: ' + this.get('id') + ' not selected.');
      if (PflegeMap.mapper.selectedFeature) {
        //console.log('selected feature id: ' + PflegeMap.mapper.selectedFeature.get('id') + ' exists unselect it.');
        PflegeMap.mapper.selectedFeature.unselect();
      }
      this.select();
    }
  };

  return feature;
};