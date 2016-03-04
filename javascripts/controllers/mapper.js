PflegeMap.mapperController = function(map) {
  return {
    scope: this,
    map: map,

  //  // dummy zum Testen bitte löschen
  //  proximityRadius: -1, // kein Umkreis gegeben, Umkreis in Meter
  //  proximityExtent: PflegeMap.maxExtent,
  //  proximityCenter: map.getView().getCenter(),

    layer: new ol.layer.Vector({
      opacity: 1,
      source: new ol.source.Vector({
        projection: PflegeMap.viewProjection,
        features: []
      })
    }),

    list: {
      add: function(feature) {
        var element = feature.getListElement();
        element.click();
        this.div.append( element );
      }
    },

    initLayer: function(store) {
      var i,
          source = this.layer.getSource();

      for (i = 0; i < store.length; i++) {
        source.addFeature(
          new PflegeMap.angebot(
            store[i]
          )
        );
      }

      this.layer.setMap(this.map);
      this.errMsgElement = $('#PflegeMap\\.errorMessage')[0];
    },

    initSearchTools: function() {
      PflegeMap.searchTools.push('textSearch');
      PflegeMap.searchTools.push('categorySearch');
      PflegeMap.searchTools.push('proximitySearch');
    },

    initList: function() {
      this.list.div = $('#PflegeMap\\.careServicesList');

      var source = this.layer.getSource(),
          features = source.getFeatures();

      features.sort(this.sortFeatures);

      for (var i = 0; i < features.length; i++) {
        this.list.add(features[i]);
      }
    },

    searchAnimation: {
      show: function() {
        $('#PflegeMap\\.searchOverlay').show();
      },
      hide: function() {
        $('#PflegeMap\\.searchOverlay').hide();
      }
    },

    sortFeatures: function (a, b) {
      var aName = a.get('versorgungsart').toLowerCase() + a.get('kategorie') + a.get('gemeinde');
      var bName = b.get('versorgungsart').toLowerCase() + b.get('kategorie') + b.get('gemeinde'); 

      return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    },

    setEventHandlers: function() {
      $('#PflegeMap\\.categorySearchTool').on(
        'click',
        this,
        this.switchSearchTools
      );

      $('#PflegeMap\\.textSearchTool').on(
        'click',
        this,
        this.switchSearchTools
      );

      // Handler for thematic search
      $('#PflegeMap\\.textSearchField').on(
        'change',
        this,
        this.wordSearch
//        this.themeSearch
      );

      // Handler for List Elements of care-services (Angebote)
      $('.pm-care-service').on(
        'click',
        this,
        this.toggleFeature
      );

      // Handler for Category-Checkboxes
      $(".cb-kat").on(
        'change',
        this,
        this.onChangeCategoryCheckBox
      );
    
      // Handler for Sub-Category-Checkboxes
      $(".cb-subkat").on(
        'change',
        this,
        this.onChangeSubCategoryCheckBox
      );
      // Handler for changes of map extent
      PflegeMap.map.on('moveend', function(evt) {
        var newExtent = evt.frameState.extent,
          source = this.layer.getSource(),
          features = source.getFeatures();
        features.forEach(function(feature){
          if (!feature.get('hidden')) {
            feature.listElement.toggle(ol.extent.containsExtent(newExtent,feature.getGeometry().getExtent()));
          }
        });
      }, this);

    },

    wordSearch: function() {
      PflegeMap.mapper.filterFeatures();
      PflegeMap.mapper.zoomToExtent();
    },

    themeSearch: function(event) {
      var source = event.data.layer.getSource(),
          features = source.getFeatures(),
          searchString = event.target.value,
          coordinates = [],
          addrCoords = $('#PflegeMap\\.addressSearchField').attr('coordinates'),
          range = $('#PflegeMap\\.proximitySelect').val(),
          i;

      PflegeMap.mapper.searchAnimation.show();

      for ( i = 0; i < features.length; i++) {
        if (searchString.length < 3 || $.inArray(features[i].get('id'), PflegeMap.suchIndex[searchString]) > -1) {
          features[i].set('hidden', false);
          $('#PflegeMap\\.careService_' + features[i].get('id')).show();
          coordinates.push(features[i].getGeometry().getCoordinates());
        } else {
          features[i].set('hidden', true);
          $('#PflegeMap\\.careService_' + features[i].get('id')).hide();
        }
      }
      event.data.layer.changed();
      if (coordinates.length > 0) {
        PflegeMap.map.getView().fit(
          ol.extent.buffer(
            ol.extent.boundingExtent(coordinates),
            300
          ),
          PflegeMap.map.getSize()
        );
      }

      PflegeMap.mapper.searchAnimation.hide();
    },

    /*
    * function liefert true wenn Filterbedingung erfüllt wird.
    * Die Filterbedingung ist, dass das Suchwort weniger als
    * 3 Zeichen hat oder das Suchwort für das Feature im Index
    * eingetragen ist.
    * Wenn die Kategorieauswahl aufgerufen ist soll der Word
    * Filter keine herausfiltern also immer true liefern.
    */
    wordFilter: function(feature) {
      var searchWord = $('#PflegeMap\\.textSearchField').val();

      if ($('#PflegeMap\\.categorySearchArea').is(':visible'))
        return true

      return (searchWord.length < 3 || $.inArray(feature.get('id'), PflegeMap.suchIndex[searchWord]) > -1);
    },

    filterFeatures: function(features) {
      var source = PflegeMap.mapper.layer.getSource(),
          features = source.getFeatures();

      features.map(function(feature) {
        if (
          PflegeMap.mapper.wordFilter(feature) &&
          PflegeMap.proximiter.proximityFilter(feature)
        )
          PflegeMap.mapper.showCareService(feature);
        else
          PflegeMap.mapper.hideCareService(feature);
      });
    },

    showCareService: function(careService) {
      careService.set('hidden', false);
      $('#PflegeMap\\.careService_' + careService.get('id')).show();
    },

    hideCareService: function(careService) {
      careService.set('hidden', true);
      $('#PflegeMap\\.careService_' + careService.get('id')).hide();
    },

    onChangeSubCategoryCheckBox: function(event) {
      var scope = event.data;
    
      var categry = event.target.getAttribute('kategorie'),
        isChecked = event.target.checked,
        versart = $(event.target).closest('.pflegemap-subcategories').siblings('.cb-kat');

      // uncheck versart-box if any of the subcatgrs is unchecked and vice versa
      var numChecked = $(".cb-subkat:checked", versart.parent()).length,
        allChecked = (numChecked == $(".cb-subkat", versart.parent()).length);
      versart.prop('checked', allChecked);
      if (numChecked > 0) $('.pflegemap-subcategories',versart.parent()).show()
      else $('.pflegemap-subcategories',versart.parent()).hide();

      scope.switchSubCategory(
        categry,
        isChecked
      );
    },
  
    onChangeCategoryCheckBox: function(event) {
      var scope = event.data;
    
      var versart = event.target.getAttribute('versart'),
        isChecked = event.target.checked;
    
      if (versart == 'all') $(".cb-kat[versart!='all']").prop('checked', isChecked).trigger('change')
      else {
        // uncheck 'all'-box if any of the catgrs is unchecked and vice versa
        var allChecked = ($(".cb-kat[versart!='all']:checked").length == $(".cb-kat[versart!='all']").length);
        $(".cb-kat[versart='all']").prop('checked', allChecked);
      }

      // show/hide and check/uncheck all subcategories
      var subcatDiv = $('div.pflegemap-subcategories', $(event.target).parent());
      subcatDiv.show();
      $('.cb-subkat', $(subcatDiv)).prop('checked',isChecked).trigger('change');
    },
  
    switchSearchTools: function(event) {
      $.each(PflegeMap.searchTools, function(index, searchTool) {
        //console.log('hide element: #PflegeMap.' + searchTool + 'Area');
        $('#PflegeMap\\.' + searchTool + 'Area').hide();
      });
      var searchType = event.target.getAttribute('toolname') || event.target.parentElement.getAttribute('toolname');
      //console.log('show element: #PflegeMap.' + searchType + 'Area');
      $('#PflegeMap\\.' + searchType + 'Area').show();
    },

    /*
    * Switch the visibility of all features with category c
    * to the visibility v
    * @params(string) c category (2 characters)
    * @params(boolean) v visibility
    * @return(void)
    */
    switchSubCategory: function(c, v) {
      var source = this.layer.getSource(),
        features = source.getFeatures(),
        i;

      for ( i = 0; i < features.length; i++) {
        if (c == features[i].get('kategorie')) {
          var hidden = v ? !(v && this.featureWithinProximity(features[i])) : !v;
          (hidden)
            ? features[i].hide()
            : features[i].show();
        }
      }

      this.layer.changed();
    },

    lookupNominatim: function(e){
      var scope = e.data,
          queryStr = e.target.value,
          url  = 'http://nominatim.openstreetmap.org/search';

      $.ajax({
        url: url,

        beforeSend: PflegeMap.mapper.searchAnimation.show,

        data: {
          viewboxlbrt    : '10.57,53.10,12.40,53.82',
          bounded        : 1,
          q              : queryStr,
          format         : 'json',
          addressdetails : 1,
        },

        // Work with the response
        success: function(response) {
          if (response.indexOf('Error') != -1 || response.indexOf('Fehler') != -1) {
            scope.showErrorMsg(scope, response);
          }
          else {
            scope.errMsgElement.innerHTML = '';
            scope.showNominatimResults(scope, response);
          }
        },

        error: function (xhr, ajaxOptions, thrownError){
          if(xhr.status==404) {
            scope.showErrorMsg(scope, thrownError);
          }
        },

        complete: PflegeMap.mapper.searchAnimation.hide()

      });
    },

    showErrorMsg: function(e, msg) {
      if (msg == 'Not Found') {
        msg = 'Der Service zum Suchen von Adressen ist nicht erreichbar. Bitte prüfen Sie ob Sie eine Netzverbindung haben.';
      }
      e.errMsgElement.innerHTML = msg;
      $('#PflegeMap\\.Overlay').fadeIn(200,function(){
        $('#PflegeMap\\.MessageBox').animate({'top':'20px'},200);
      });
    },

    showNominatimResults: function(event, results) {
      console.log('showNominatimResults in mapper.js scope: %o', scope);
      $('#' + event.target.id.replace('.', '\\.') + 'AddressSearchResultBox').html(
        event.data.searchResultsFormatter(
          event,
          results
        )
      );
      $('#' + event.target.id.replace('.', '\\.') + 'AddressSearchResultBox').show();

      $('#PflegeMap\\.proximityAddressSearchResultBox').html(scope.searchResultsFormatter(results));
      $('#PflegeMap\\.proximityAddressSearchResultBox').show();
    },

    searchResultsFormatter: function(results) {
      var html = '';
      if(typeof results != "undefined" && results != null && results.length > 0) {
        html = results.map(function(item) {
          return "<a href=\"#\" onclick=\"PflegeMap.mapper.addSearchResultFeature('" + item.display_name + "', " + item.lat + ", " + item.lon + ");\">" + item.display_name + '</a><br>';
        });
      }
      else {
        html = 'keine Treffer gefunden!'
      }
      return html;
    },

    /*
    * Filter care service features in proximity radius, zoom to extent and add marker in center
    */
    addSearchResultFeature: function(display_name, lat, lon) {
      PflegeMap.geocoder.addSearchResultFeature('proximityAddress', display_name, lat, lon);
    },

    featureWithinProximity: function(feature){
      var featureCoords = feature.getGeometry().getCoordinates(),
          centerCoords = PflegeMap.proximiter.proximityCenter;
          withinExtent = ol.extent.containsCoordinate(PflegeMap.proximiter.proximityExtent, featureCoords);
          withinDistance = withinExtent 
          ? ((featureCoords[0] - centerCoords[0])^2 + (featureCoords[0] - centerCoords[0])^2) > PflegeMap.proximiter.proximityRadius^2 
          : false;
    
      return withinDistance;
    },

    zeigeEinrichtungen: function(store, layer) {
      var features = [];
      for (var i = 0; i < store.length; i++){
        var feature = new PflegeMap.angebot(store[i]);
        features.push(feature);
      }
      layer.setSource(new ol.source.Vector({
        features: features
      }));
    
      // Vektorlayer zur Karte hinzufügen
      vektorLayer.setMap(this.map);
    },
  
    toggleFeature: function(event) {
      var features = PflegeMap.mapper.layer.getSource().getFeatures(),
          target = $(event.target),
          selected_id = (target.length == 0) ? target.attr('feature_id') : target.parents(".pm-care-service").attr('feature_id'),
          i;
      features.map(function(feature) {
        if (feature.get('id') == selected_id)
          feature.toggle();
      });
    },

    zoomToExtent: function() {
      var featureCoordinates = PflegeMap.mapper.layer.getSource().getFeatures().filter(
            function(feature) {
              return !feature.get('hidden');
            }
          ).map(
            function(feature) {
              return feature.getGeometry().getCoordinates();
            }
          ),
          searchResultCoordinates = PflegeMap.geocoder.layer.getSource().getFeatures().map(
            function(feature) {
              return feature.getGeometry().getCoordinates();
            }
          ),
          extent = ol.extent.boundingExtent(
            $.merge(
              featureCoordinates,
              searchResultCoordinates
            )
          );

      if (!ol.extent.isEmpty(extent))
        PflegeMap.map.getView().fit(
          extent,
          PflegeMap.map.getSize()
        );
    }
  };
};