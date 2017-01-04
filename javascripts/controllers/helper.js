PflegeMap.helpController = {

  initHelp: function() {
    PflegeMap.searchTools.push('help');
  },

  setEventHandler: function() {
    $('#PflegeMap\\.helpTool').on(
      'click',
      this,
      this.showHelpPage
    );

    $('#PflegeMap\\.HelpBoxClose').click(function() {
        $('#PflegeMap\\.HelpBox').hide();
      $('#PflegeMap\\.HelpBox').animate({'top':'-1000px'},500,function(){
        $('#PflegeMap\\.Overlay').fadeOut('fast');
      });
    });
  },

  showHelpPage: function() {
    $('#PflegeMap\\.HelpBox').show();
    $('#PflegeMap\\.Overlay').fadeIn(200,function(){
      $('#PflegeMap\\.HelpBox').animate({'top':'40px'},200);
    });
  }
};