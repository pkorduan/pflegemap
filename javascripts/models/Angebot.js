PflegeMap.angebot = function(params) {
  var feature = new ol.Feature({
    id: params.id,
    type: 'Angebot',
    angebot: params.angebot,
    titel: params.titel,
    name: params.name,
    kategorie: params.kategorie,
    fachrichtung: params.fachrichtung,
    versorgungsart: params.versorgungsart,
    geometry: new ol.geom.Point([Number(params.x), Number(params.y)]),
    einrichtung: params.einrichtung,
    strasse: params.strasse,
    hnr: params.hnr,
    plz: params.plz,
    gemeinde: params.gemeinde,
    ortsteil: params.ortsteil,
    traeger: params.traeger,
    ansprechpartner: params.ansprechpartner,
    telefon: params.telefon,
    email: params.email,
    internet: params.internet,
    kapazitaet: params.kapazitaet,
    besonderheit: params.besonderheit,
    hidden: true,
    active: true,
    selected: false,
    icon: (function() {
      switch (params.versorgungsart){
        case 'Ambulante Pflege':
          return params.angebot;
        case 'Ambulanter Pflegedienst': // Löschen wenn es die Versorgungsart nicht mehr gibt.
          return params.angebot;
        case 'Beratung':
          return params.versorgungsart;
        case 'Gesundheit':
          return params.angebot;
        case 'Kurzzeitpflege':
          return params.angebot;
        case 'Pflegeheim':
          return params.angebot;
        case 'Stationäre Pflege':
          return params.angebot;
        case 'Sterbebegleitung':
          return params.versorgungsart;
        case 'Tagespflege':
          return params.angebot; // Löschen wenn es die Versorgungsart nicht mehr gibt.
        case 'Teilstationäre Pflege':
          return params.angebot;
        case 'Wohnen':
          return params.angebot;
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
    html += '<a name="PflegeMap.careService_' + this.get('id') + '"></a><b>' + this.anrede() + '</b><br>';
    if (this.get('traeger') != '')
      html += '<i>Träger:</i> ' + this.get('traeger') + '<br>';

    if (this.get('kategorie') == 'az') {
      html += '<i>Fachrichtung:</i> ' + this.get('fachrichtung');
    }
    else {
      html += '<i>Kategorie:</i> ' + this.get('angebot');
    }

    if (this.get('kapazitaet') != '' && this.get('kapazitaet') > 0)
      html += '<br><i>Kapazität:</i> ' + this.get('kapazitaet');
    if ($.inArray(this.get('versorgungsart'), [
      'Stationäre Pflege',
      'Pflegeheim',
      'Kurzzeitpflege'
    ]) > -1 ) {
      html += '<br><a href="http://kreis-lup.de/leben-im-landkreis/verkehr-ordnung-sicherheit/heimaufsicht/" target="_blank"><i class="fa fa-external-link"></i> Prüfbericht der Heimaufsicht</a>';
    }
    if (this.get('kategorie') == 'az') {
      html += '<br><a href="http://www.kvmv.info/patienten/40/" target="_blank"><i class="fa fa-external-link"></i> Arztsuche Mecklenburg-Vorpommern</a>'
    }
    html += '</div>';

    html += '<div class="small-100 medium-80 large-40 columns">';
    html += this.contact();
    html += '</div>';

    html += '<div class="pm-list-functions small-100 medium-20 large-15 columns push">';
    html += '<div class="pm-list-function-from"><i class="fa fa-flag-o fa-fw "></i> Route von hier</div>';
    html += '<div class="pm-list-function-to"><i class="fa fa-flag-checkered fa-fw"></i> Route nach hier</div>';
    html += "<a href=\"#PflegeMap.top\"><i class=\"fa fa-map-marker fa-fw\"></i> zur Karte</a>";
    html += '</div>';
    html += '</div>';
    html += '<div class="pflegemap-clear"></div>';
    this.listElement = $(html);
    return this.listElement;
  };

  feature.data = function() {
    var html = '';
    html += (this.get('kategorie') == 'az' ? this.get('fachrichtung') : this.get('angebot')) + '<br>';
    html += (this.get('ansprechpartner') != '' ? this.get('ansprechpartner') + '<br>' : '');
    html += this.address();
    html += (this.get('telefon') != '' ? '<br>Tel: ' + this.get('telefon') : '');
    html += '<a href="#PflegeMap.careService_' + this.get('id') + '" style="float: right">Details</a>';
    return html;
  };

  feature.anrede = function() {
    var anrede = '';
    if (this.get('kategorie') == 'az' && this.get('titel'))
      anrede = this.get('titel') + ' ';
    anrede += this.get('name');
    return anrede
  }

  feature.address = function() {
    var address = [];
    if (this.get('strasse'))
      address.push(this.get('strasse'));
    if (this.get('hnr'))
      address.push(this.get('hnr'));
    if (address.length > 0)
      address.push('<br>'); 
    if (this.get('plz'))
      address.push(this.get('plz'));
    if (this.get('gemeinde'))
      address.push(this.get('gemeinde'));
    if (this.get('ortsteil'))
      address.push('(' + this.get('ortsteil') + ')');
    return address.join(' ');
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

  feature.popupText = function() {
    return ('<tr><td><img class="pm-eingerueckt" src="./images/' + this.get('icon') + '.png" style="margin-right: 10px"/></td><td><a onclick="PflegeMap.mapper.switchToOtherFeature(' + this.get('id') + ')">' + this.anrede() + '</a></td></tr>');
  };

  feature.xy = function() {
    var xy = this.getGeometry().getCoordinates();
    return xy[0] + ', ' + xy[1];
  };

  feature.latlng = function() {
    var lnglat = ol.proj.transform(this.getGeometry().getCoordinates(), PflegeMap.viewProjection, PflegeMap.baseProjection);
    return [lnglat[1], lnglat[0]];
  };

  feature.preparePopup = function(moreFeatures) {
    PflegeMap.popup.feature = this;
    $('#PflegeMap\\.popup').attr('class','pm-popup pm-angebot');

    if (moreFeatures.length > 1) {
      html = $.map(moreFeatures, function(feature) {
          return feature.popupText();
      }).join('<br>');
      $('#PflegeMap\\.popup-title').hide();
      $('#PflegeMap\\.popup-data').hide();
      $('.pm-popup-function-from').hide();
      $('.pm-popup-function-to').hide();
      $('.pm-popup-function-more').show();
    }
    else {
      $('#PflegeMap\\.popup-title').html(this.anrede()).show();
      $('#PflegeMap\\.popup-data').html(this.data()).show();
      $('.pm-popup-function-from').show();
      $('.pm-popup-function-to').show();
      html = '';
      $('.pm-popup-function-more').hide();
    }
    $('.pm-popup-function-clear').hide();
    $('#PflegeMap\\.popup-function-more-content').html(html);
  };

  feature.setInfo = function() {
    PflegeMap.popup.infoFeature = this;
    $('#PflegeMap\\.popup').attr('class','pm-popup pm-angebot');
    $('#PflegeMap\\.popup-title').html(this.anrede()).show();
    $('#PflegeMap\\.popup-data').html(this.data()).show();
    $('.pm-popup-function-from').show();
    $('.pm-popup-function-to').show();
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
      // hide Layer with search radius drawings
//      PflegeMap.mapper.searchCircleLayer.setVisible(false);
      PflegeMap.mapper.searchCircleLayer.hide();
      PflegeMap.mapper.selectedFeatureLayer.hide();
    }
  };

  feature.select = function(single = false) {
    var features = (PflegeMap.config.cluster ? PflegeMap.mapper.layer.getSource().getSource().getFeatures() : PflegeMap.mapper.layer.getSource().getFeatures()),
        selectedFeature = this,
        resolution = PflegeMap.map.getView().getResolution();

    if (!selectedFeature.get('selected')) {
      //console.log('Select angeobt feature: ' + this.get('id'));

      if (single) {
        moreFeatures = [];
        selectedFeature.showInFront();
      }
      else {
        // find more features in the near of selected
        searchBuffer = ol.extent.buffer(selectedFeature.getGeometry().getExtent(), resolution * PflegeMap.config.searchRadiusFactor);
        moreFeatures = $.grep(features, function(feature, index) {
          return (
            !feature.get('hidden') &&
            ol.extent.containsCoordinate(searchBuffer, feature.getGeometry().getCoordinates())
          );
        });
      }

      // show popup
      selectedFeature.preparePopup(moreFeatures);
      PflegeMap.popup.setPosition(
        selectedFeature.getGeometry().getCoordinates()
      );
      if (moreFeatures.length > 1) {
        selectedFeature.drawMoreFeatureRadius(moreFeatures);
        selectedFeature.showInFront();
      } else {
        // hide moreFeatureRadius;
        //PflegeMap.searchCircleLayer.setVisible(false);
        PflegeMap.popup.infoFeature = false;
      }

      // highlight the list Element
      //console.log('highlight list element');
      selectedFeature.listElement.toggleClass('pm-care-service-highlighted');

      // set this feature to selected
      selectedFeature.set('selected', true);
      PflegeMap.mapper.selectedFeature = selectedFeature;
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
      this.select('single');
    }
  };

  feature.drawMoreFeatureRadius = function(moreFeatures) {
    var layer = PflegeMap.mapper.searchCircleLayer,
        circle = layer.getSource().getFeatures()[0].getGeometry(),
        resolution = PflegeMap.map.getView().getResolution();

    circle.setCenter(this.getGeometry().getCoordinates());

    circle.setRadius(resolution * PflegeMap.config.searchRadiusFactor);

    layer.setVisible(true);
  };

  feature.showInFront = function() {
    var layer = PflegeMap.mapper.selectedFeatureLayer,
        feature = layer.getSource().getFeatures()[0],
        geometry = feature.getGeometry();

    feature.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 0.95,
          src: 'images/' + this.get('icon') +  '.png'
        })
      })
    );

    geometry.setCoordinates(this.getGeometry().getCoordinates());

    layer.setVisible(true);
  };

  return feature;
};