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

    noFeaturesMessage: {
      show: function() {
        $('#PflegeMap\\.noFeatureMessage').show();
      },
      hide: function() {
        $('#PflegeMap\\.noFeatureMessage').hide();
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

      // Handler to show more care-service results at this position
      $('#PflegeMap\\.popup .pm-popup-function-more-toggle').off();
      $('#PflegeMap\\.popup .pm-popup-function-more-toggle').on(
        'click',
        {
          popup: PflegeMap.popup
        },
        this.toggleMoreCareServices
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
        var source = this.layer.getSource(),
            features = source.getFeatures();

        PflegeMap.mapper.redrawFeatures();
      }, this);

    },

    wordSearch: function() {
      PflegeMap.mapper.zoomToExtent();
      PflegeMap.mapper.filterFeatures();
    },

    /*
    * function liefert true wenn Filterbedingung erfüllt wird.
    * Die Filterbedingung ist, dass das Suchwort weniger als
    * 3 Zeichen hat oder das Suchwort für das Feature im Index
    * eingetragen ist.
    * Wenn die Kategorieauswahl oder die Reachsuche aufgerufen ist,
    * soll der Word Filter keine herausfiltern also immer true liefern.
    */
    wordFilter: function(feature) {
      var searchWord = $('#PflegeMap\\.textSearchField').val();

//      if ($('#PflegeMap\\.categorySearchArea').is(':visible') || $('#PfelgeMap\\.reachSearchArea').is(':visible'))
//        return true

      return (searchWord.length < 3 || $.inArray(feature.get('id'), PflegeMap.suchIndex[searchWord]) > -1);
    },

    /*
    * Diese Funktion liefert true zurück, wenn die Kategorie des Feature
    * in der Kategoriesuche (Themen) ausgewählt ist.
    */
    categoryFilter: function(feature) {
      result = $($("[kategorie='" + feature.get('kategorie') + "']")[0]).is(':checked')
      //console.log('categoryFilter: ' + result);
      return result;
    },

    /*
    * Diese Funktion filtert die Feature entsprechend der aktuellen
    * Such- und Karteneinstellungen. Feature, die zum Filter passen
    * werden angezeigt und die anderen ausgeblendet.
    *
    * Folgende Logik beim Filtern:
    * Variante A:
    *   Ist textSearchArea visible:
    *     Wende den word und proximity filter an
    *   Ist categorySearchArea visible
    *     Wende den categorie und reach filter an
    *   Ist reachSearchArea visible
    *     Wende den reach und category filter an
    *   und Wende immer den extendFilter an
    */
    filterFeatures: function(features) {
      //console.log('filterFeatures');
      var source = PflegeMap.mapper.layer.getSource(),
          view = PflegeMap.mapper.map.getView(),
          size = PflegeMap.mapper.map.getSize(),
          features = source.getFeatures(),
          numVisible = 0,
          categoryCount = [];

      features.map(function(feature) {
        //console.log('feature: ' + feature.get('name'));
        filterResult = false;
        category = feature.get('kategorie');

        // Variante A

/*        if ($('#PflegeMap\\.textSearchArea').is(':visible')) {
          filterResult = PflegeMap.mapper.wordFilter(feature) &&
                         PflegeMap.proximiter.proximityFilter(feature)
        }
*/
        if ($('#PflegeMap\\.categorySearchArea').is(':visible')) {
          filterResult = PflegeMap.mapper.categoryFilter(feature) &&
                         PflegeMap.proximiter.proximityFilter(feature) &&
                         PflegeMap.reacher.reachAreaFilter(feature);
        }
        if ($('#PflegeMap\\.reachSearchArea').is(':visible')) {
          filterResult = PflegeMap.reacher.reachAreaFilter(feature) &&
                         PflegeMap.mapper.categoryFilter(feature);
        }

        //console.log('feature ' + feature.get('name') + ' is:' + (filterResult ? ' activ' : ' not active'));
        feature.set('active', filterResult);
      });
    },

    /**
    * This function show aktive features inside the current map view
    * and feature list. It will be regularly used after zoom and pan.
    * Aktive features are thus meets the filter criteria.
    */
    redrawFeatures: function() {
      var source = PflegeMap.mapper.layer.getSource(),
          view = PflegeMap.mapper.map.getView(),
          size = PflegeMap.mapper.map.getSize(),
          currentExtent = view.calculateExtent(size),
          features = source.getFeatures(),
          numVisible = 0,
          categoryCount = [];

      features.map(function(feature) {
        if (
          feature.get('active') &&
          ol.extent.containsCoordinate(
            currentExtent,
            feature.getGeometry().getCoordinates()
          )
        ) {
          category = feature.get('kategorie');
          PflegeMap.mapper.showCareService(feature);
          categoryCount[category] = (categoryCount[category] ? categoryCount[category] + 1 : 1);
          numVisible += 1;
        }
        else
          PflegeMap.mapper.hideCareService(feature);
      });

      PflegeMap.mapper.updateCategoryCount(categoryCount);
      if (numVisible > 0) {
        $('#PflegeMap\\.numFeatures').text('(' + numVisible + ' Treffer)');
        PflegeMap.mapper.noFeaturesMessage.hide();
      } else {
        $('#PflegeMap\\.numFeatures').text('(' + numVisible + ' Treffer)');
        PflegeMap.mapper.noFeaturesMessage.show();
      }
    },

    updateCategoryCount: function(categoryCount) {
      $.each($("[Kategorie]"), function(i, field) {
        category = field.getAttribute('Kategorie');
        numFeature = categoryCount[category];
        html = (numFeature ? '(' + numFeature + ')' : '');
        $('#PflegeMap\\.numFeature_' + category).html(html);
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

    onChangeSubCategoryCheckBox: function(event, applyFilter) {
      var scope = event.data;
    
      var categry = event.target.getAttribute('kategorie'),
        isChecked = event.target.checked,
        versart = $(event.target).closest('.pflegemap-subcategories').siblings('.cb-kat');

      // uncheck versart-box if any of the subcatgrs is unchecked and vice versa
      var numChecked = $(".cb-subkat:checked", versart.parent()).length,
        allChecked = (numChecked == $(".cb-subkat", versart.parent()).length);
      versart.prop('checked', allChecked);
      if (numChecked > 0)
        $('.pflegemap-subcategories',versart.parent()).show()
      else
        $('.pflegemap-subcategories',versart.parent()).hide();

      // hide subCategory if only one exists
      if ($(event.target).parent().siblings().length == 0)
        $(event.target).parent().hide();

      if (typeof applyFilter === "undefined") {
        PflegeMap.mapper.filterFeatures();
        //PflegeMap.mapper.zoomToExtent();
        PflegeMap.mapper.redrawFeatures();
      }
    },
  
    onChangeCategoryCheckBox: function(event, applyFilter) {
      //console.log('onChangeCategoryCheckBox');
      var scope = event.data,
          versart = event.target.getAttribute('versart'),
          isChecked = event.target.checked;

      if (versart == 'all') {
        $(".cb-kat[versart!='all']").prop('checked', isChecked).trigger('change', 'do not apply filter');
        // filterFeatures()
      }
      else {
        //console.log('change categroy check box: ' + versart);
        // uncheck 'all'-box if any of the catgrs is unchecked and vice versa
        var allChecked = ($(".cb-kat[versart!='all']:checked").length == $(".cb-kat[versart!='all']").length);
        $(".cb-kat[versart='all']").prop('checked', allChecked);
      }

      // show/hide and check/uncheck all subcategories
      var subcatDiv = $('div.pflegemap-subcategories', $(event.target).parent());

      $('.cb-subkat', $(subcatDiv)).prop('checked',isChecked).trigger('change', 'do not apply filter');

      if (typeof applyFilter === "undefined") {
        PflegeMap.mapper.filterFeatures();
       // PflegeMap.mapper.zoomToExtent();
        PflegeMap.mapper.redrawFeatures();
      }
    },
  
    switchSearchTools: function(event) {
      $.each(PflegeMap.searchTools, function(index, searchTool) {
        $('#PflegeMap\\.' + searchTool + 'Area').hide();
        $('#PflegeMap\\.' + searchTool + 'Tool').attr("class", "pflegemap-search-tool-icon");
      });
      var searchType = event.target.getAttribute('toolname') || event.target.parentElement.getAttribute('toolname');
      $('#PflegeMap\\.' + searchType + 'Tool').toggleClass("highlighted");
      $('#PflegeMap\\.' + searchType + 'Area').show();
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
        html = '<a href="#" onclick="PflegeMap.geocoder.removeSearchResultFeature();">keine Treffer gefunden!</a>';
      }
      return html;
    },

    /*
    * Filter care service features in proximity radius, zoom to extent and add marker in center
    */
    addSearchResultFeature: function(display_name, lat, lon) {
      PflegeMap.geocoder.addSearchResultFeature('proximityAddress', display_name, lat, lon);
    },

    toggleMoreCareServices: function(event) {
      $('#PflegeMap\\.popup-function-more-content').toggle();
      $('#pm-popup-function-more-icon').toggleClass('fa-caret-square-o-right fa-caret-square-o-down');
    },

    switchToOtherFeature: function(selected_id) {
      var features = (PflegeMap.config.cluster ? this.layer.getSource().getSource().getFeatures() : this.layer.getSource().getFeatures()),
          resolution = PflegeMap.map.getView().getResolution();

      // find selected feature by id
      features.map(function(feature) {
        if (feature.get('id') == selected_id) {
          feature.setInfo();
        }
      });
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
      //console.log('zoomToExtent');
      var featureCoordinates = PflegeMap.mapper.layer.getSource().getFeatures().filter(
            function(feature) {
              if (feature.get('active'))
                //console.log('feature active')
              return feature.get('active');
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
    },

    zoomToMaxExtent: function() {
      PflegeMap.map.getView().fit(
        PflegeMap.maxExtent,
        PflegeMap.map.getSize()
      );
    }
    
  };
};