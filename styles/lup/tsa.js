$(document).ready(function(){

});


function initTsaInfo(){

	clearInterval(tsaTimer);
	
	$(".tsaid_QueryElementSingleViewPerson .tsaid_FULLNAME").click(function(){
		toggleAnsprechpartner($(this).parent());
	});
	
	// TODO Optimierung - folgendes in tsa-connector.jsp verschieben: (fuer .tsaid_tsabox muss erst die Einbindung auf serverseitig umgestellt werden)
	$(".tsabox a[href^='mailto:'], .tsaid_tsabox a[href^='mailto:']").each(function(){
		$(this).parent().prepend($(this).html()+"<br/>");
		$(this).attr("title", "E-Mail senden an "+$(this).html());
		$(this).html("E-Mail senden");		
	});

	$(".tsabox a[onclick^='mapwin='], .tsaid_tsabox a[onclick^='mapwin=']").each(function(){
		$(this).attr("title", "Anfahrtskarte anzeigen");
		$(this).html("Anfahrtskarte anzeigen");		
	});
	
	// stoerende Umbrueche entfernen - ab 05.08.2015 durch TSA-Update nicht mehr relevant
	$(".tsaid_OrganisationalUnitData .tsaid_POSTADRESSE .tsaid_data").each(function(){
		var sHtml = $(this).html().slice(0, -8);
		$(this).html(sHtml);
	});
	$(".tsaid_OrganisationalUnitData .tsaid_PHONE .tsaid_data").each(function(){
		var sHtml = $(this).html().slice(0, -4);
		$(this).html(sHtml);
	});	
	
	// Bemerkungsfeld bei Telefonnr. bereinigen
	$(".tsaid_comment").each(function(){
		var sHtml = ($(this).html()).replace("Bemerkung: ", "");
		$(this).html(sHtml);
	});	
	
	// Downloadlink der Formulare auf den Formularnamen uebertragen
	$(".tsaid_QueryElementSingleViewForm").each(function(){
		var href = $(this).find(".tsaid_DOWNLOAD a").attr("href");
		$(this).find(".tsaid_DOWNLOAD").hide();
		var html = $.trim($(this).find(".tsaid_NAME .tsaid_data").html());
		$(this).find(".tsaid_NAME .tsaid_data").html("<a href='"+href+"' target='_blank' title='"+html+"'>"+html+"</a>");
	});	
	
	// Trenner einfuegen
	if($(".tsaid_tsabox").length > 0){
		var tsaboxtrenner = "<div class=\"tsaboxtrenner\"></div>";
		
		$(".tsaid_tsabox").find("#tsaid_AnsichtOE_01").append(tsaboxtrenner);
		
		if($("#tsaid_ListeOE_01").length > 0 && $.trim($(".tsaid_tsabox").find("#tsaid_AnsichtPerson_01").html()) != "")
			$("#tsaid_AnsichtPerson_01").append(tsaboxtrenner);
			
		if($("#tsaid_ListeAnsichtFormular_01").length > 0 && $.trim($("#tsaid_ListeAnsichtFormular_01").html()) != "")
			$("#tsaid_ListeAnsichtFormular_01").append(tsaboxtrenner);
		
		if($("#tsaid_ListeAnsichtPerson_01").length > 0){
			if($.trim($("#tsaid_ListeAnsichtPerson_01").html()) != ""){

				var myArray = $("#tsaid_ListeAnsichtPerson_01 .tsaid_QueryElementSingleViewPerson");
				myArray.sort(function (a, b) {				    
				    a = $.trim($(a).find(".tsaid_FULLNAME .tsaid_data").html());
				    b = $.trim($(b).find(".tsaid_FULLNAME .tsaid_data").html());

				    if(a > b) {
				        return 1;
				    } else if(a < b) {
				        return -1;
				    } else {
				        return 0;
				    }				    
				});
				$("#tsaid_ListeAnsichtPerson_01").append(myArray);			
				
				$(".tsaid_tsabox").find("#tsaid_SuchfeldFB_01").append(tsaboxtrenner);
				$(".tsaid_tsabox").find("#tsaid_SuchfeldOE_01").append(tsaboxtrenner);
			}else{
				$("#tsaid_ListeAnsichtPerson_01").hide();
			}
		}
	}
	
}

function toggleAnsprechpartner(ap){
    if ($(ap).find(".tsaid_POSITION").is(':hidden')) {
    	$(ap).find(".tsaid_FULLNAME ~ div").show("slow");
    } else {
    	$(ap).find(".tsaid_FULLNAME ~ div").hide("slow");
    }
}

var tsaTimer = setInterval(function(){ 	
	if($("#ytsa_main").length > 0 || $(".tsabox").length > 0){
		initTsaInfo();
	}
}, 500);


