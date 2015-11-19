PflegeMap.mapperController = {
  scope: this,

  layer: new ol.layer.Vector({
    opacity: 1,
    source: new ol.source.Vector({
      features: []
    })
  }),

  list: {
    add: function(feature) {
      var element = feature.listElement();
      element.click();
      this.div.append( element );
    },
    hide: function(feature) {
      console.log('list.hide');
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

    this.layer.setMap(PflegeMap.map);

  },

  initList: function() {
    this.list.div = $('#PflegeMap\\.careServicesList');

    var source = this.layer.getSource(),
        features = source.getFeatures();

    for (i = 0; i < features.length; i++) {
      this.list.add(features[i]);
    }
  },

  setEventHandler: function() {

    // Handler für Kategorie-Checkboxen
    $(".cb-kat").on(
      'change',
      this,
      this.switchCategoryCheckBox
    );

    // Handler für "alle Kategorien"
    $("#cb-all-kat").on(
      'change',
      this,
      this.switchAllCategoryCheckBox
    );
  },

  switchCategoryCheckBox: function(event) {
    var scope = event.data;

    scope.switchCategorie(
      event.target.getAttribute('kategorie'),
      event.target.checked
    );
/*
    // refresh display
    var einrichtungen = [];
    $(".cb-kat").each(function(){
      if (this.checked) {
        var cb = this,
            filterAntwort = store.filter(
              function(elem) {
                return elem.kategorie == cb.getAttribute('kategorie');
              },
              cb
            ),
            einrichtungen = einrichtungen.concat(filterAntwort);
      }
    });
    scope.zeigeEinrichtungen(einrichtungen, vektorLayer);
      */
  },

  switchAllCategoryCheckBox: function(event) {
    var scope = event.data,
        source = scope.layer.getSource();

    if (event.target.checked) {
      console.log('checked');
/*      $(".cb-kat").each(
        function() {
          this.checked = true;
        }
      );
      scope.zeigeEinrichtungen(store, vektorLayer); */
    }
    else {
      console.log('unchecked');
/*      $(".cb-kat").each(
        function(){
          this.checked = false;
        }
      );
      this.mapper.zeigeEinrichtungen([], vektorLayer);*/
    }
  },

  /*
   * Switch the visibility of all features with category c
   * to the visibility v
   * @params(string) c category (2 characters)
   * @params(boolean) v visibility
   * @return(void)
   */
  switchCategorie: function(c, v) {
    console.log('Switch visibility of all features with categorie: ' + c + ' to ' + v);
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
    vektorLayer.setMap(map);
  }
  
//    zeigeEinrichtungen(store, map);
  
/*
    setEventHandler: function() {
    $("#search").on(
      'change',
      this,
      this.lookupNominatim
    );
  }
*/
};