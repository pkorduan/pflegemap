PflegeMap.helpController = {

  initHelp: function() {
    PflegeMap.searchTools.push('routingSearch');
  },

  setEventHandler: function() {
    $('#PflegeMap\\.helpTool').on(
      'click',
      this,
      this.showHelpPage
    );

    $('#PflegeMap\\.HelpBoxClose').click(function() {
      $('#PflegeMap\\.HelpBox').animate({'top':'-200px'},500,function(){
        $('#PflegeMap\\.Overlay').fadeOut('fast');
      });
    });
  },

  showHelpPage: function() {
    msg = '<h4>Hilfe und Hinweise zur Nutzung dieser Seite</h4><br>Die Angaben zu Ärzten und Apotheken müssen nicht aktuelle sein.<br><br><br><br><br><br>';
    $('#PflegeMap\\.helpMessage')[0].innerHTML = msg;
    $('#PflegeMap\\.Overlay').fadeIn(200,function(){
      $('#PflegeMap\\.HelpBox').animate({'top':'20px'},200);
    });
  }
};