<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Responsives Raster</title>

    <link rel="shortcut icon" href="http://kreis-lup.de/export/system/modules/de.sis.lup/resources/images/favicon.png">
    <link rel="stylesheet" href="./styles/lup/style.css">
    <link rel="stylesheet" href="./styles/lup/LUP.css">
    <link rel="stylesheet" href="./styles/lup/jquery.fancybox.css">
    <link rel="stylesheet" href="./styles/lup/add.css">
    <link rel="stylesheet" href="./styles/lup/css" type="text/css">
    <link rel="stylesheet" href="./styles/lup/css(1)" type="text/css">

<link rel="stylesheet" href="3rdparty/font-awesome-4.0.3/css/font-awesome.min.css" type="text/css">
<link rel="stylesheet" href="3rdparty/awesomplete-gh-pages/awesomplete.css" type="text/css"/>
<link rel="stylesheet" href="styles/css/map.css" type="text/css">
<style>

/* Gestaltung des Beispiels */

body {font-size: 1.3em;}
/*
strong {
  background:black;
  color:white;
}
*/
/*header { background: #ff0000; }
nav { background: #ff9900; }
article:nth-of-type(1) { background: #0099ff; }
article:nth-of-type(2) { background: #66cc00; }
aside { background: #ff0099; }
footer { background: #ffff00; }
*/

.columns div {
  margin: 0.2em;
  padding: 0.2em;
}

.list {
  margin: 0.2em;
  background-color: #eee;
  border:2px solid #ddd;
  -moz-border-radius: 20px;
  -webkit-border-radius:20px;
  -khtml-border-radius:20px;
  -moz-box-shadow: 0 1px 5px #333;
  -webkit-box-shadow: 0 1px 5px #333;
}

.columns .map {
  background-color: #eef;
  border:2px solid #ddd;
  -moz-border-radius: 20px;
  -webkit-border-radius:20px;
  -khtml-border-radius:20px;
  -moz-box-shadow: 0 1px 5px #333;
  -webkit-box-shadow: 0 1px 5px #333;
}

/* Raster */

* {
	-webkit-box-sizing:border-box;
	-moz-box-sizing:border-box;
	box-sizing:border-box;
}

.row {
  width:auto;
}

.row:before, 
.row:after {
  content: " ";
  display: table;
}

.row:after {
    clear: both;
}

.columns {
  float:left;
}

.push {
  float:right;
}

@media screen and (max-width:700px) {

/* Small */
.small-100 {width:100%; max-width:480px;}

.small-map {width:480px;}

}

@media screen and (min-width:700px) and (max-width:1000px) {

/* Medium */

.medium-20 {width:20%; max-width:140px;}

.medium-30 {width:30%; max-width:280px;}

.medium-70 {width:70%; max-width:490px;}

.medium-80 {width:80%; max-width:560px;}

.medium-100 {width:100%; max-width:700px;}

.medium-map {width:700px;}

.medium-input {width:450px;}

}

@media screen and (min-width:1000px) {

/* Large */
.large-10 {width:10%; max-width:100px;}

.large-20 {width:20%; max-width:200px;}

.large-40 {width:40%; max-width:400px;}

.large-60 {width:60%; max-width:600px;}

.large-70 {width:70%; max-width:700px;}

.large-100 {width:100%; max-width:1000px;}

.large-map {width:1000px;}

.large-input {width:550px;}
}

</style>

</head>

<body>

<div class="row">
  <header class="small-100 medium-100 large-100 columns">
     <div>
      <strong>Pflegeportal</strong>
    </div>
</header>
</div>

<div class="row">
  <aside class="small-100 medium-30 large-20 columns push">
       <div>
          <button
            id="PflegeMap.textSearchTool"
            class="pflegemap-search-tool-icon"
            toolname="textSearch"
            title="Textsuche"
            alt="Textsuche">
              <i class="fa fa-inverse fa-search"></i>
          </button> Suche<br>
          <button
            id="PflegeMap.categorySearchTool"
            class="pflegemap-search-tool-icon"
            toolname="categorySearch"
            title="Kategoriesuche"
            alt="Kategoriesuche">
              <!-- i class="fa fa-lg fa-inverse fa-filter"></i-->
              <i class="fa fa-inverse fa-check-square-o"></i>
          </button> Themen<br>
          <button
            id="PflegeMap.routingSearchTool"
            class="pflegemap-search-tool-icon"
            toolname="routingSearch"
            title="Routing"
            alt="Routing">
              <i class="fa fa-inverse fa-flag-checkered"></i>
          </button> Routing<br>
          <button
            id="PflegeMap.reachSearchTool"
            class="pflegemap-search-tool-icon"
            toolname="reachSearch"
            title="Erreichbarkeitsanalyse"
            alt="Erreichbarkeitsanalyse">
              <i class="fa fa-inverse fa-clock-o"></i>
          </button> Erreichbarkeit<br>
          <button
            id="PflegeMap.helpTool"
            class="pflegemap-search-tool-icon"
            toolname="help"
            title="Hilfe"
            alt="Hilfe und Hinweise">
              <i class="fa fa-inverse fa-question"></i>
          </button> Hilfe
        </div> 
  </aside>
    <article class="small-100 medium-70 large-60 columns">
     <div>
        Was suchen Sie?<br>
        <input type="text" class="small-map medium-input large-input"><br>
        Wo suchen Sie?<br>
        <input type="text" class="small-map medium-input large-input"><br>
        Im Umrkeis von: <select>
          <option>1 km</option>
          <option>2 km</option>
          <option>5 km</option>
        </select>
    </div>
  </article>
  <article class="small-100 medium-100 large-20 columns">
      <div>
        <input id="PflegeMap.removeRouteButton" class="pflegemap-routing-button" type="button" value="Route löschen"/><br>
        <input id="PflegeMap.calcRouteButton" class="pflegemap-routing-button" type="button" value="Route berechnen"/>
      </div>
  </article>
</div>

<div class="row">
<article class="small-100 medium-100 large-100 columns">
   <div class="map small-map medium-map large-map">
      <strong>Map</strong><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </div> 
</article>
</div>

<div class="row list small-map medium-map large-map">
    <article class="small-100 medium-80 large-40 columns">
      <strong>Alten-und Pflegeheim Neu Krenzlin</strong><br>
        Versorgungsart: Stationäre Pflege<br>
        Kategorie: Kurzzeitpflege<br>
        Träger: Gutshof-Stiftung Krenzlin<br>
        Kapazität: 2<br>
        Kapazität: 179<br>
        Besonderheit: einschl. Whg. in Rosa-Luxemburg-Straße 8,9, Ziegendorfer Chaussee 90-93
    </article>
    <article class="small-100 medium-80 large-40 columns">
Herr Blaschkowski<br>
Vogelsang 32<br>
19370 Parchim<br>
03871 720148<br>
swa-st.martin@caritas-mecklenburg.de<br>
www.caritas-mecklenburg.de

    </article>
    <article class="small-100 medium-20 large-20 columns">
        <a onclick="alert(\'Funktion noch nicht implementiert\');"><i class="fa fa-flag-o fa-fw"></i> Route von hier</a><br>
        <a onclick="alert(\'Funktion noch nicht implementiert\');"><i class="fa fa-flag-checkered fa-fw"></i> Route nach hier</a><br>
        <a onclick="windows.location(#PflegeMap.top)"><i class="fa fa-map-marker fa-fw"></i> zur Karte</a>
    </article>
</div>
<div class="row list small-map medium-map large-map">
    <article class="small-100 medium-80 large-40 columns">
      <strong>Alten-und Pflegeheim Neu Krenzlin</strong><br>
        Versorgungsart: Stationäre Pflege<br>
        Kategorie: Kurzzeitpflege<br>
        Träger: Gutshof-Stiftung Krenzlin<br>
        Kapazität: 2<br>
        Kapazität: 179<br>
        Besonderheit: einschl. Whg. in Rosa-Luxemburg-Straße 8,9, Ziegendorfer Chaussee 90-93
    </article>
    <article class="small-100 medium-80 large-40 columns">
Herr Blaschkowski<br>
Vogelsang 32<br>
19370 Parchim<br>
03871 720148<br>
swa-st.martin@caritas-mecklenburg.de<br>
www.caritas-mecklenburg.de

    </article>
    <article class="small-100 medium-20 large-20 columns">
        <a onclick="alert(\'Funktion noch nicht implementiert\');"><i class="fa fa-flag-o fa-fw"></i> Route von hier</a><br>
        <a onclick="alert(\'Funktion noch nicht implementiert\');"><i class="fa fa-flag-checkered fa-fw"></i> Route nach hier</a><br>
        <a onclick="windows.location(#PflegeMap.top)"><i class="fa fa-map-marker fa-fw"></i> zur Karte</a>
    </article>
</div>
<div class="row list small-map medium-map large-map">
    <article class="small-100 medium-80 large-40 columns">
      <strong>Alten-und Pflegeheim Neu Krenzlin</strong><br>
        Versorgungsart: Stationäre Pflege<br>
        Kategorie: Kurzzeitpflege<br>
        Träger: Gutshof-Stiftung Krenzlin<br>
        Kapazität: 2<br>
        Kapazität: 179<br>
        Besonderheit: einschl. Whg. in Rosa-Luxemburg-Straße 8,9, Ziegendorfer Chaussee 90-93
    </article>
    <article class="small-100 medium-80 large-40 columns">
Herr Blaschkowski<br>
Vogelsang 32<br>
19370 Parchim<br>
03871 720148<br>
swa-st.martin@caritas-mecklenburg.de<br>
www.caritas-mecklenburg.de

    </article>
    <article class="small-100 medium-20 large-20 columns">
        <a onclick="alert(\'Funktion noch nicht implementiert\');"><i class="fa fa-flag-o fa-fw"></i> Route von hier</a><br>
        <a onclick="alert(\'Funktion noch nicht implementiert\');"><i class="fa fa-flag-checkered fa-fw"></i> Route nach hier</a><br>
        <a onclick="windows.location(#PflegeMap.top)"><i class="fa fa-map-marker fa-fw"></i> zur Karte</a>
    </article>
</div>
</body>
</html>