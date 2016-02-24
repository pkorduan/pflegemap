<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Responsives Raster</title>

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

.columns .list {
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
.small-100 {width:100%;}

}

@media screen and (min-width:700px) and (max-width:1000px) {

/* Medium */

.medium-20 {width:20%;}

.medium-30 {width:30%;}

.medium-70 {width:70%;}

.medium-100 {width:100%;}

}

@media screen and (min-width:1000px) {

/* Large */
.large-10 {width:10%;}

.large-20 {width:20%;}

.large-60 {width:60%;}

.large-70 {width:70%;}

.large-100 {width:100%;}

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
                <i class="fa fa-lg fa-inverse fa-search"></i>
            </button> Suche<br>
            <button
              id="PflegeMap.categorySearchTool"
              class="pflegemap-search-tool-icon"
              toolname="categorySearch"
              title="Kategoriesuche"
              alt="Kategoriesuche">
                <!-- i class="fa fa-lg fa-inverse fa-filter"></i-->
                <i class="fa fa-lg fa-inverse fa-check-square-o"></i>
            </button> Themen<br>
            <button
              id="PflegeMap.routingSearchTool"
              class="pflegemap-search-tool-icon"
              toolname="routingSearch"
              title="Routing"
              alt="Routing">
                <i class="fa fa-lg fa-inverse fa-flag-checkered"></i>
            </button> Routing<br>
            <button
              id="PflegeMap.reachSearchTool"
              class="pflegemap-search-tool-icon"
              toolname="reachSearch"
              title="Erreichbarkeitsanalyse"
              alt="Erreichbarkeitsanalyse">
                <i class="fa fa-lg fa-inverse fa-clock-o"></i>
            </button> Erreichbarkeit<br>
            <button
              id="PflegeMap.helpTool"
              class="pflegemap-search-tool-icon"
              toolname="help"
              title="Hilfe"
              alt="Hilfe und Hinweise">
                <i class="fa fa-lg fa-inverse fa-question"></i>
            </button> Hilfe
          </div> 
    </aside>
    <article class="small-100 medium-70 large-60 columns">
     <div>
        Was suchen Sie?<br>
        <input type="text" size="90"><br>
        Wo suchen Sie?<br>
        <input type="text" size="90"><br>
        Im Umrkeis von: <select>
          <option>1 km</option>
          <option>2 km</option>
          <option>5 km</option>
        </select>
    </div>
  </article>
  <article class="small-100 medium-100 large-20 columns push">
      <div>
        <input id="PflegeMap.removeRouteButton" class="pflegemap-routing-button" type="button" value="Route löschen"/><br>
        <input id="PflegeMap.calcRouteButton" class="pflegemap-routing-button" type="button" value="Route berechnen"/>
      </div>
  </article>
</div>

<div class="row">
<footer class="small-100 medium-100 large-100 columns">
   <div class="map">
      <strong>Map</strong><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </div> 
</footer>
</div>

<div class="row">
<footer class="small-100 medium-100 large-100 columns">
   <div class="list">
      <strong>Alten-und Pflegeheim Neu Krenzlin</strong><br>
      Versorgungsart: Stationäre Pflege, Kategorie: Kurzzeitpflege, Träger: Gutshof-Stiftung Krenzlin, Kapazität: 2, Streuplätze<br>
      Frau Schultz, Lindenstraße 7, 19288 Alt Krenzlin, Tel: 038751 3360, E-Mail: verwaltung@ph-krenzlin.de, Web: www.ph-krenzlin.de
    </div>
   <div class="list">
      <strong>Alten-und Pflegeheim Neu Krenzlin</strong><br>
      Versorgungsart: Stationäre Pflege, Kategorie: Kurzzeitpflege, Träger: Gutshof-Stiftung Krenzlin, Kapazität: 2, Streuplätze<br>
      Frau Schultz, Lindenstraße 7, 19288 Alt Krenzlin, Tel: 038751 3360, E-Mail: verwaltung@ph-krenzlin.de, Web: www.ph-krenzlin.de
    </div> 
   <div class="list">
      <strong>Alten-und Pflegeheim Neu Krenzlin</strong><br>
      Versorgungsart: Stationäre Pflege, Kategorie: Kurzzeitpflege, Träger: Gutshof-Stiftung Krenzlin, Kapazität: 2, Streuplätze<br>
      Frau Schultz, Lindenstraße 7, 19288 Alt Krenzlin, Tel: 038751 3360, E-Mail: verwaltung@ph-krenzlin.de, Web: www.ph-krenzlin.de
    </div> 
   <div class="list">
      <strong>Alten-und Pflegeheim Neu Krenzlin</strong><br>
      Versorgungsart: Stationäre Pflege, Kategorie: Kurzzeitpflege, Träger: Gutshof-Stiftung Krenzlin, Kapazität: 2, Streuplätze<br>
      Frau Schultz, Lindenstraße 7, 19288 Alt Krenzlin, Tel: 038751 3360, E-Mail: verwaltung@ph-krenzlin.de, Web: www.ph-krenzlin.de
    </div> 
   <div class="list">
      <strong>Alten-und Pflegeheim Neu Krenzlin</strong><br>
      Versorgungsart: Stationäre Pflege, Kategorie: Kurzzeitpflege, Träger: Gutshof-Stiftung Krenzlin, Kapazität: 2, Streuplätze<br>
      Frau Schultz, Lindenstraße 7, 19288 Alt Krenzlin, Tel: 038751 3360, E-Mail: verwaltung@ph-krenzlin.de, Web: www.ph-krenzlin.de
    </div> 
</footer>
</div>

</body>
</html>