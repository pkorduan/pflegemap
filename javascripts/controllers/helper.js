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
      $('#PflegeMap\\.HelpBox').animate({'top':'-1000px'},500,function(){
        $('#PflegeMap\\.Overlay').fadeOut('fast');
      });
    });
  },

  showHelpPage: function() {
    $('#PflegeMap\\.Overlay').fadeIn(200,function(){
      $('#PflegeMap\\.HelpBox').animate({'top':'40px'},200);
    });
  }
};