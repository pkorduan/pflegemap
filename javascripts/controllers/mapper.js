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

    for (var i = 0; i < features.length; i++) {
      this.list.add(features[i]);
    }
  },

  // Handler für Kategorie-Checkboxen
  setEventHandler: function() {
    $(".cb-kat").on(
      'change',
      this,
      this.switchCategoryCheckBox
    );
  },

  switchCategoryCheckBox: function(event) {
    var scope = event.data;

    scope.switchCategorie(
      event.target.getAttribute('kategorie'),
      event.target.checked
    );
  },

  /*
   * Switch the visibility of all features with category c
   * to the visibility v
   * @params(string) c category (2 characters)
   * @params(boolean) v visibility
   * @return(void)
   */
  switchCategorie: function(c, v) {
    var source = this.layer.getSource(),
      features = source.getFeatures(),
      i,
      all_categories = (c == 'all');

    if (all_categories) $(".cb-kat").prop('checked', v);

    for ( i = 0; i < features.length; i++) {
      if (c == features[i].get('kategorie') || all_categories) {
        features[i].set('hidden', !v);
        features[i].changed();
        (v)
          ? $('#PflegeMap\\.careService_' + features[i].get('id')).show()
          : $('#PflegeMap\\.careService_' + features[i].get('id')).hide();
      }
    }

    this.layer.changed();
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

};