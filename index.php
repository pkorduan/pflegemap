<!DOCTYPE html>
<html lang="de" class="js svg">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <!--[if lt IE 9]><meta http-equiv="refresh" content="1; URL=http://www.kreis-lup.de/shared/browser/outofdate.html"><![endif]-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta property="og:title" content="Pflegeangebote">
    <meta property="og:image" content="">
    <title>Landkreis Ludwigslust-Parchim - Plegeportal</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="index, follow" name="robots">
    <link rel="shortcut icon" href="http://kreis-lup.de/export/system/modules/de.sis.lup/resources/images/favicon.png">
    <link rel="stylesheet" href="./styles/lup/style.css">
    <link rel="stylesheet" href="./styles/lup/LUP.css">
    <link rel="stylesheet" href="./styles/lup/jquery.fancybox.css">
    <link rel="stylesheet" href="./styles/lup/add.css">
    <link rel="stylesheet" href="./styles/lup/css" type="text/css">
    <link rel="stylesheet" href="./styles/lup/css(1)" type="text/css">
    <style type="text/css">
      .fancybox-margin{margin-right:0px;}
      .u-full-width {
        width: 95%;
        box-sizing: border-box;
      }
      .u-max-full-width {
        max-width: 100%;
        box-sizing: border-box;
      }
      .u-pull-right {
        float: right;
      }
      .u-pull-left {
        float: left;
      }
    </style>

    <script id="twitter-wjs" src="./styles/lup/widgets.js"></script><script src="./styles/lup/jquery.min.js"></script>
    <script src="./styles/lup/modernizr.js"></script>
    <script src="./styles/lup/jquery.fancybox.pack.js"></script>
    <script src="./styles/lup/default.js"></script>
    <script src="./styles/lup/tsa.js"></script>
    <script src="./styles/lup/button.aec556e1a316f63b43fda3ae1e6a3e10.js" type="text/javascript" charset="utf-8" async="" ></script>

    <!-- header for map //-->
    <!--link rel="stylesheet" href="3rdparty/Skeleton/css/skeleton.css"//-->
    <link rel="stylesheet" href="3rdparty/OpenLayers/v3.8.2/css/ol.css" type="text/css">
    <link rel="stylesheet" href="styles/css/grid.css" type="text/css">
    <link rel="stylesheet" href="styles/css/map.css" type="text/css">
    <link rel="stylesheet" href="3rdparty/font-awesome-4.6.3.2/css/font-awesome.min.css" type="text/css">
    <script src="3rdparty/jQuery/jquery-1.11.2.min.js"></script>
    <script src="3rdparty/OpenLayers/v3.8.2/build/ol-debug.js"></script>
    <script src="3rdparty/proj4js/proj4.js"></script>
    <script src="3rdparty/proj4js/25833.js"></script>
    <!--script src="3rdparty/awesomplete-gh-pages/awesomplete.js" async></script-->
    <link rel="stylesheet" href="3rdparty/awesomplete-gh-pages/awesomplete.css" type="text/css"/>

    <script type="text/javascript">
      /**
       * Define a namespace for the application.
       */
      window.PflegeMap = {};
      var PflegeMap = window.PflegeMap;
    </script>
    <script src="javascripts/config.js"></script>
    <script src="javascripts/pflegemap.js"></script>
    <script src="javascripts/models/SearchResult.js"></script>
    <script src="javascripts/models/Angebot.js"></script>
    <script src="javascripts/models/Route.js"></script>
    <script src="javascripts/models/RoutePoint.js"></script>
    <script src="javascripts/models/ReachArea.js"></script>
    <script src="javascripts/controllers/mapper.js"></script>
    <script src="javascripts/controllers/router.js"></script>
    <script src="javascripts/controllers/geocoder.js"></script>
    <script src="javascripts/controllers/proximiter.js"></script>
    <script src="javascripts/controllers/reacher.js"></script>
    <script src="javascripts/controllers/helper.js"></script>
  </head>
  <body class="purple" style="background: url(http://kreis-lup.de/export/sites/LUP/.galleries/LUP-Allgemein-Aktuelles-und-Presse/Service-Verwaltung/DSC_0474.JPG_1979318820.jpg) no-repeat center center fixed; -webkit-background-size: cover; background-size: cover;">
    <ul id="skiplinks">
      <li><a href="http://kreis-lup.de/buergerservice-verwaltung/zustaendigkeiten/#hauptnavigation">Zur Hauptnavigation</a></li>
      <li><a href="http://kreis-lup.de/buergerservice-verwaltung/zustaendigkeiten/#navi-meta">Zur Metanavigation</a></li>
      <li><a href="http://kreis-lup.de/buergerservice-verwaltung/zustaendigkeiten/#content-main">Zum Hauptinhalt der Seite</a></li>
      <li><a href="http://kreis-lup.de/buergerservice-verwaltung/zustaendigkeiten/#content-sub">Zum Inhalt der Randspalte</a></li>
    </ul>
    <section class="container">
      <header class="" style="bottom: auto; top: auto;">
        <a href="http://kreis-lup.de/" title="Zur Startseite">
          <div id="logo"></div>
        </a>
      </header>
      <button id="open-button" class="menu-button">Menü öffnen</button>
      <aside class="navcolumn">
        <a name="hauptnavigation"></a>
        <nav class="main">
          <ul>
            <li class="blue">
              <a name="hauptnavigation" href="http://kreis-lup.de/">Startseite</a>
            </li>
            <li class="sub green">
              <a href="http://kreis-lup.de/leben-im-landkreis/">Leben im Landkreis</a>
            </li>
            <li class="sub purple active">
              <a href="http://kreis-lup.de/buergerservice-verwaltung/">Service &amp; Verwaltung</a>
            </li>
            <li class="sub blue">
              <a href="http://kreis-lup.de/kreistag/">Kreistag</a>
            </li>
            <li class="red">
              <a href="http://kreis-lup.de/wirtschaft/">Wirtschaft</a>
            </li>
            <li class="orange">
              <a href="http://kreis-lup.de/tourismus/">Tourismus</a>
            </li>
          </ul>
        </nav>
        <div class="standard">
          <h4 class="headline"></h4>
          <p></p>
          <ul class="linklist">
            <li><a class="" href="http://kreis-lup.de/kreistag/kreisrecht/">Kreisrecht</a></li>
          </ul>
        </div>
        <div class="locationbox">
          <h4 class="headline">Landkreis Ludwigslust-Parchim</h4>
          <p></p><p><span style="text-decoration: underline;">Postanschrift</span>:<br>Postfach 12 63<br>19362 Parchim</p>
          <p>Tel.: 03871 722-0 <br>Fax: 03871 722-77-7777<br><a href="http://kreis-lup.de/buergerservice-verwaltung/service-am-telefon/">Behördennummer 115</a></p>
          <p>E-Mail:<br><a href="mailto:info@kreis-lup.de">info@kreis-lup.de</a></p><p></p>
        </div>
        <div class="locationbox">
          <h4 class="headline">Verwaltungssitz Parchim</h4>
          <img src="./styles/lup/DSC_0474.JPG_1979318820.jpg" width="260" height="172" title=" © " alt=""><p></p><p>Putlitzer Str. 25<br>19370 Parchim</p><p></p>
          <ul class="linklist">
            <li><a target="_blank" class="download" href="http://kreis-lup.de/leben-im-landkreis/bauen-wohnen/vermessung-geoinformation/Anfahrt-PCH/index.html#">Anfahrt</a></li>
          </ul>
        </div>
        <div class="locationbox">
          <h4 class="headline">Standort Ludwigslust</h4>
          <img src="./styles/lup/DSC_0359.JPG_63075828.jpg" width="260" height="150" title=" © " alt=""><p></p><p>Garnisonsstr. 1<br>19288 Ludwigslust</p><p></p>
          <ul class="linklist">
            <li><a target="_blank" class="download" href="http://kreis-lup.de/leben-im-landkreis/bauen-wohnen/vermessung-geoinformation/Anfahrt-LWL/index.html#">Anfahrt</a></li>
          </ul>
        </div>
        <div class="locationbox">
        <h4 class="headline">Öffnungszeiten der Verwaltung</h4>
        <p></p>
        <p>Montag 8 - 13 Uhr<br>Dienstag 8 - 13 und 14 - 18 Uhr<br>
          Mittwoch 8 - 13 Uhr<br>Donnerstag&nbsp;8 - 13 und 14 - 18 Uhr<br>
          Freitag 8 - 13 Uhr<br>oder nach Vereinbarung&nbsp;
        </p>
        <p><a href="https://www.facebook.com/LudwigslustParchim" target="_blank"><img style="width: 27px;" title="fb" src="./styles/lup/fb.png" alt="" height="27">&nbsp; Ludwigslust-Parchim auf facebook</a></p>
        <p></p>
        <p>
          <script>
            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
          </script>
        </p>
        <p></p>
        <ul class="linklist">
            <li><a class="" href="http://kreis-lup.de/kontakt/">Kontakt</a></li>
            <li><a class="" href="http://kreis-lup.de/impressum/">Impressum</a></li>
            <li><a class="" href="http://kreis-lup.de/datenschutz/">Datenschutz</a></li>
            </ul>
        </div>
      </aside>
      <section class="content" style="min-height: 2187px;">
        <div class="wrapper mobile-full" style="width:880px;">
          <div id="centercontainer">
            <article class="clear row">

              <div id="PflegeMap.Overlay" class="pflegemap-overlay" style="display:none;"></div>

              <div id="PflegeMap.searchOverlay" class="pflegemap-search-overlay" style="display:none">
                <div id="PflegeMap.searchAnimation" class="pflegemap-search-animation">
                  <i class="fa fa-5x fa-spinner fa-spin"></i>
                </div>
              </div>

              <div id="PflegeMap.MessageBox" class="pflegemap-message-box">
                <a id="PflegeMap.MessageBoxClose" class="pflegemap-message-box-close"></a>
                <span id="PflegeMap.errorMessage"></span>
              </div>

              <div id="PflegeMap.HelpBox" class="pflegemap-help-box">
                <a id="PflegeMap.HelpBoxClose" class="pflegemap-help-box-close"></a>
                <span id="PflegeMap.helpMessage"><?php if (file_exists('help.html')) { include('help.html'); } else { ?>
<!-- Hier den Hilfetext ersetzen, wenn kein php vom Server unterstützt wird. //-->
                  
<h1>Hilfe und Hinweise zur Nutzung dieser Seite</h1>
<h2>Ambulanter Pflegedienst</h2>
Damit ältere hilfe- und pflegebedürftige Menschen möglichst lange in der gewohnten Wohnung bleiben können, ist oft die Einbeziehung professioneller ambulanter Dienste notwendig, um eine gute pflegerische Versorgung im Privathaushalt auch über längere Zeit sicherzustellen und die pflegenden Angehörigen zu entlasten.
<h2>Tagespflege</h2>
Die Tagespflege ist eine teilstationäre Einrichtung nach § 41 SGB XI, die von den Pflegekassen mitfinanziert wird. Pflegebedürftige haben Anspruch auf teilstationäre Pflege in Einrichtungen der Tages- oder Nachtpflege, wenn häusliche Pflege nicht in ausreichendem Umfang sichergestellt werden kann oder wenn dies zur Ergänzung oder Stärkung der häuslichen Pflege erforderlich ist.
<h2>Pflegeheim</h2>
Nach § 43 SGB XI haben Pflegebedürftige Anspruch auf Pflege in vollstationären Einrichtungen, wenn teilstationäre oder häusliche Pflege nicht möglich ist oder wegen der Besonderheit des einzelnen Falles nicht in Betracht kommt.
<h2>Kurzzeit- und Verhinderungspflege</h2>
Kurzzeitpflege nach § 42 SGB XI wird als zeitlich befristete stationäre Pflege für bis zu acht Wochen finanziert. Sie ist ein Angebot für Pflegebedürftige, deren pflegende Angehörige wegen Krankheit, Urlaub oder aus anderen Gründen verhindert sind. Auch für die Nachsorge nach einem Krankenhausaufenthalt, wenn eine Rückkehr in den Privathaushalt noch nicht möglich ist, wird das Angebot der Kurzzeitpflege genutzt.
<h2>Betreutes Wohnen</h2>
Im Betreuten Wohnen wird den älteren Menschen ermöglicht, die Eigenständigkeit ihres eigenen Haushaltes aufrecht zu erhalten und zugleich die Hilfestrukturen, die Kommunikationsmöglichkeiten und das Sicherheitsgefühl einer unterstützenden Wohnform in Anspruch nehmen zu können.
<h2>Betreute Senioren- und Pflege-Wohngruppen</h2>
In betreuten Wohngruppen leben etwa 8 bis 12 hilfe- und pflegebedürftige Bewohnerinnen und Bewohner in einem gemeinsamen Haushalt zusammen und werden von Betreuungskräften unterstützt.
<h2>Gesundheitsversorgung</h2>
Niedergelassene Ärzte, Kliniken und Apotheken haben einen zentralen Stellenwert für Pflegebedürftige und ihre Angehörigen, da mit ärztlicher Unterstützung zukünftige Lebensformen weitgehend geplant und entschieden werden. Der Landkreis Ludwigslust-Parchim verweist auf die Arztsuche der Kassenärztlichen Vereinigung Mecklenburg-Vorpommern.
<h2>Sterbebegleitung</h2>
Innerhalb des Landkreises gibt es im Bereich Sterbebegleitung drei ambulante Hospizdienste mit ehrenamtlichen Begleiterinnen und Begleitern. Im Vordergrund steht die ambulante Betreuung mit dem Ziel, sterbenden Menschen ein möglichst würdevolles und selbstbestimmtes Leben bis zum Ende zu ermöglichen sowie die Familie in diesem Prozess zu begleiten, zu entlasten und zu unterstützen. (Rahmenvereinbarung nach § 39a Abs. 2 Satz 7 SGB V)  
<h2>Pflegestützpunkt</h2>
Die Pflegestützpunkte in Ludwigslust und Parchim bieten Bürgerinnen und Bürgern eine kostenlose, trägerneutrale und kompetente Beratung und Unterstützung aus einer Hand rund um das Thema Pflege an. Träger der Pflegestützpunkte sind die Kranken- und Pflegekassen im Land gemeinsam mit dem Landkreis Ludwigslust-Parchim. 
<h2>Prüfbericht Heimaufsicht</h2>
Die in der Übersicht aufgelisteten vollstationären Pflegeeinrichtungen nach dem SGB XI und vollstationären Einrichtungen für Hilfen nach dem SGB XII werden durch die Heimaufsicht des Landkreises Ludwigslust-Parchim, gemäß § 8 EQG M-V mindestens einmal im Jahr überprüft. Die wesentlichen Ergebnisse der Prüfungen sind gemäß § 13 EQG M-V veröffentlicht.
<h2>Webseite und Karte verkleinern bzw. vergrößern</h2>
Sie können die Webseite mit der Karte verkleinern oder vergrößern. Halten Sie die Taste „Strg“ gedrückt und drücken Sie zusätzlich „+“, um hineinzuzoomen, „-„ um herauszuzoomen oder „0“, um den Zoom auf den Ausgangswert zurückzusetzen.

<!-- Hier endet der Hilfetext //-->
                <?php } ?></span>
              </div>

              <!-- header //-->
                <div class="small-100 medium-100 large-100 columns">
                   <div>
                    <strong>Pflegeportal</strong>
                  </div>
                </div>

              <!-- search //-->
              <div class="list small-map medium-map large-map">

                <!-- search tools //-->
                <aside class="small-100 medium-20 large-10 columns">
                   <div id="PflegeMap.searchToolbox" class="pflegemap-search-toolbox">
                      <button
                        id="PflegeMap.categorySearchTool"
                        class="pflegemap-search-tool-icon highlighted"
                        toolname="categorySearch"
                        title="Kategoriesuche"
                        alt="Kategoriesuche">
                          <!-- i class="fa fa-lg fa-inverse fa-filter"></i-->
                          <i class="fa fa-inverse fa-check-square-o"></i>
                      </button> Themen<br>
                      <button
                        id="PflegeMap.textSearchTool"
                        class="pflegemap-search-tool-icon"
                        toolname="textSearch"
                        title="Textsuche"
                        alt="Textsuche">
                          <i class="fa fa-inverse fa-search"></i>
                      </button> Suche<br>
                      <button
                        id="PflegeMap.reachSearchTool"
                        class="pflegemap-search-tool-icon"
                        toolname="reachSearch"
                        title="Erreichbarkeitsanalyse"
                        alt="Erreichbarkeitsanalyse">
                          <i class="fa fa-inverse fa-clock-o"></i>
                      </button> Erreichbarkeit<br>
                      <button
                        id="PflegeMap.routingSearchTool"
                        class="pflegemap-search-tool-icon"
                        toolname="routingSearch"
                        title="Routing"
                        alt="Routing">
                          <i class="fa fa-inverse fa-flag-checkered"></i>
                      </button> Routing<br>
                      <button
                        id="PflegeMap.helpTool"
                        class="pflegemap-search-tool-icon"
                        toolname="help"
                        title="Hilfe"
                        alt="Hilfe und Hinweise">
                          <i class="fa fa-inverse fa-question"></i>
                      </button> Hinweise
                    </div> 
                </aside>

                <!-- searchAreas //-->
                <div class="small-100 medium-80 large-90 columns">
                  <div id="PflegeMap.textSearchArea" class="pflegemap-search-area" style="display:none">
                    Was suchen Sie?<br>
                    <input id="PflegeMap.textSearchField" class="pflegemap-search-field small-input medium-input large-input" list="PflegeMap.searchWords" type="text" placeholder="Pflegeeinrichtungen suchen ..."/><datalist id="PflegeMap.searchWords"></datalist>
                    <div id="PflegeMap.textSearchResultBox" class="pflegemap-search-result-box" style="display:none;"></div><br>
                    Wo suchen Sie?<br>
                    <input id="PflegeMap.proximitySearchField" class="pflegemap-search-field small-input medium-input large-input" type="text" placeholder="Adresse suchen ..."/>
                    <div id="PflegeMap.proximitySearchFieldResultBox" class="pflegemap-search-result-box small-input medium-input large-input" style="display:none;"></div><br>
                    Im Umkeis von:<br>
                    <select id="PflegeMap.proximitySelect">
                      <option value="-1" selected="selected">--</option>
                      <option value="1000">1km</option>
                      <option value="2000">2km</option>
                      <option value="5000">5km</option>
                      <option value="10000">10km</option>
                      <option value="20000">20km</option>
                      <option value="40000">40km</option>
                    </select>
                  </div>

                  <!-- categorySearchArea //-->
                  <div id="PflegeMap.categorySearchArea">
                    <div id="list" class="pflegemap-categories">
                      <label style="margin-left:0.5em;">
                        <input versart="all" class="cb-kat" type="checkbox">
                        <span class="label-body">alle Versorgungsarten <b>(bitte mindestens eine Versorgungsart auswählen)</b></span>
                      </label>

                      <label>
                        <input versart="Ambulante Pflege" class="cb-kat" type="checkbox">
                        <!-- Die Versorgungsart lautet eigentlich Ambulante Pflege, angezeigt werden soll aber das Angebot also Pflegedienst //-->
                        <span class="label-body">Ambulanter Pflegedienst <span id="PflegeMap.numFeature_pd"></span><img src="./images/Ambulante Pflege.png"></img></span>
                        <div class="pflegemap-subcategories">
                          <label>
                            <input kategorie="pd" class="cb-subkat" type="checkbox" disabled readonly>
                            <span class="label-body">Ambulanter Pflegedienst <span id="PflegeMap.numFeature_pd"></span></span>
                          </label>
                        </div>
                      </label>

                      <label>
                        <input versart="Teilstationäre Pflege" class="cb-kat" type="checkbox">
                        <!-- Die Versorgungsart lautet eigentlich Teilstationäre Pflege, angezeigt werden soll aber das Angebot also Tagespflege //-->
                        <span class="label-body">Tagespflege <span id="PflegeMap.numFeature_tp"></span><img src="./images/Teilstationäre Pflege.png"></img></span>
                        <div class="pflegemap-subcategories">
                          <label>
                            <input kategorie="tp" class="cb-subkat" type="checkbox" disabled readonly>
                            <span class="label-body">Tagespflege <span id="PflegeMap.numFeature_tp"></span></span>
                          </label>
                        </div>
                      </label>

                      <label>
                        <input versart="Stationäre Pflege" class="cb-kat" type="checkbox">
                        <!-- Die Versorgungsart lautet eigentlich Stationäre Pflege, angezeigt werden soll aber das Angebot also Pflegeheim //-->
                        <span class="label-body">Pflegeheim <span id="PflegeMap.numFeature_ph"></span><img src="./images/Pflegeheim.png"></img></span>
                        <div class="pflegemap-subcategories">
                          <label>
                            <input kategorie="ph" class="cb-subkat" type="checkbox" disabled readonly>
                            <span class="label-body">Pflegeheim <span id="PflegeMap.numFeature_ph"></span></span>
                          </label>
                        </div>
                      </label>

                      <label>
                        <input versart="Stationäre Pflege" class="cb-kat" type="checkbox">
                        <!-- Die Versorgungsart lautet eigentlich Stationäre Pflege, angezeigt werden soll aber das Angebot also Kurzzeitpflege //-->
                        <span class="label-body">Kurzzeitpflege <span id="PflegeMap.numFeature_kp"></span><img src="./images/Kurzzeitpflege.png"></img></span>
                        <div class="pflegemap-subcategories">
                          <label>
                            <input kategorie="kp" class="cb-subkat" type="checkbox" disabled readonly>
                            <span class="label-body">Kurzzeitpflege <span id="PflegeMap.numFeature_kp"></span></span>
                          </label>
                        </div>
                      </label>

                      <label>
                        <input versart="Wohnen" class="cb-kat" type="checkbox">
                        <span class="label-body">Wohnen<img src="./images/Wohnen.png"></img></span>
                        <div class="pflegemap-subcategories">
                          <label>
                            <input versart="Wohnen" kategorie="bw" class="cb-subkat" type="checkbox">
                            <span class="label-body">Betreutes Wohnen <span id="PflegeMap.numFeature_bw"></span><img src="./images/Betreutes Wohnen.png"></img></span>
                          </label>
                          <label>
                            <input versart="Wohnen" kategorie="wg" class="cb-subkat" type="checkbox">
                            <span class="label-body">Ambulant betreute Wohngemeinschaft <span id="PflegeMap.numFeature_wg"></span><img src="./images/Ambulant betreute Wohngemeinschaft.png"></img></span>
                          </label>
                          <!--label>
                            <input kategorie="ba" class="cb-subkat" type="checkbox" disabled readonly>
                            <span class="label-body">Barrierearmes Wohnen</span>
                          </label>
                          <label>
                            <input kategorie="bf" class="cb-subkat" type="checkbox" disabled readonly>
                            <span class="label-body">Barrierefreies Wohnen</span>
                          </label//-->
                        </div>
                      </label>

                      <label>
                        <input versart="Gesundheit" class="cb-kat" type="checkbox">
                        <span class="label-body">Gesundheit<img src="./images/Gesundheit.png"></img></span>
                        <div class="pflegemap-subcategories">
                          <label style="display:none">
                            <input kategorie="az" class="cb-subkat" type="checkbox">
                            <span class="label-body">Arzt <span id="PflegeMap.numFeature_az"></span></span>
                          </label>
                          <label>
                            <a href="http://www.kvmv.info/patienten/40/" target="_blank"><i class="fa fa-external-link"></i> Arzt</a>
                          </label>
                          <label>
                            <input kategorie="ap" class="cb-subkat" type="checkbox">
                            <span class="label-body">Apotheke <span id="PflegeMap.numFeature_ap"></span></span>
                          </label>
                          <!--label>
                            <input kategorie="kr" class="cb-subkat" type="checkbox" disabled readonly>
                            <span class="label-body">Klinik/Reha</span>
                          </label>
                          <label>
                            <input kategorie="pt" class="cb-subkat" type="checkbox" disabled readonly>
                            <span class="label-body">Psychiatrische Tagesklinik</span>
                          </label //-->
                        </div>
                      </label>

                      <label>
                        <input versart="Sterbebegleitung" class="cb-kat" type="checkbox">
                        <span class="label-body">Sterbebegleitung <span id="PflegeMap.numFeature_hp"></span><img src="./images/Sterbebegleitung.png"></img></span>
                        <div class="pflegemap-subcategories">
                          <label>
                            <input kategorie="hp" class="cb-subkat" type="checkbox" disabled readonly>
                            <span class="label-body">Ambulanter Hospizdienst <span id="PflegeMap.numFeature_hp"></span></span>
                          </label>
                        </div>
                      </label>

                      <label>
                        <input versart="Beratung" class="cb-kat" type="checkbox">
                        <span class="label-body">Beratung <span id="PflegeMap.numFeature_nb"></span><img src="./images/Beratung.png"></img></span>
                        <div class="pflegemap-subcategories">
                          <label>
                            <input kategorie="nb" class="cb-subkat" type="checkbox" disabled readonly>
                            <span class="label-body">Neutrale Pflege- und Sozialberatung <span id="PflegeMap.numFeature_nb"></span></span>
                          </label>
                        </div>
                      </label>
                    </div>
                  </div>

                  <!-- reach search area //-->
                  <div id="PflegeMap.reachSearchArea" style="display:none">
                    Ausgangspunkt der Erreichbarkeitssuche:<br>
                    <input
                      id="PflegeMap.reachSearchField"
                      class="pflegemap-search-field small-input medium-input large-input"
                      type="text"
                      placeholder="Ereichbarkeit von Adresse ..."
                    />
                    <div
                      id="PflegeMap.reachSearchFieldResultBox"
                      class="pflegemap-reach-result-box small-input medium-input large-input"
                      style="display:none;">
                    </div><br>
                    Maximale Entfernung:<br>
                    <select id="PflegeMap.reachMinutes">
                      <option value="5" selected="selected">5 Minuten</option>
                      <option value="10">10 Minuten</option>
                      <option value="15">15 Minuten</option>
                      <option value="20">20 Minuten</option>
                      <option value="30">30 Minuten</option>
                      <option value="45">45 Minuten</option>
                      <option value="60">1 Stunde</option>
                    </select><br>
                    <input id="PflegeMap.removeReachButton" class="pflegemap-reach-button" type="button" value="Gebiet löschen"/>
                  </div>

                  <!-- routing search aarea //-->
                  <div id="PflegeMap.routingSearchArea" class="pflegemap-search-area" style="display:none">
                    Startadresse:<br>
                    <input
                      id="PflegeMap.sourceField"
                      class="pflegemap-routing-search-field small-input medium-input large-input"
                      type="text"
                      coordinates=""
                      value=""
                      placeholder="Startadresse eingeben ..."/><br>
                    <div id="PflegeMap.sourceFieldAddressSearchResultBox" class="pflegemap-search-result-box small-input medium-input large-input" style="display:none;"></div>
                    Zieladresse:<br>
                    <input
                      id="PflegeMap.targetField"
                      class="pflegemap-routing-search-field small-input medium-input large-input"
                      type="text"
                      coordinates=""
                      value=""
                      placeholder="Zieladresse eingeben ..."/><br>
                    <div id="PflegeMap.targetFieldAddressSearchResultBox" class="pflegemap-search-result-box small-input medium-input large-input" style="display:none;"></div><br>
                    <input id="PflegeMap.removeRouteButton" class="pflegemap-routing-button" type="button" value="Route löschen"/>
                    <span
                      class="pflegemap-routing-option-icon"
                      toolname="car"
                      title="Berechnung für KfZ"
                      alt="Berechnung für KfZ">
                        <i class="fa fa-inverse fa-car"></i>
                    </span>
                    <span id="PflegeMap.routingDuration" class="pflegemap-routing-result"></span>
                    <span id="PflegeMap.routingDistance" class="pflegemap-routing-result"></span>
                  </div>
                </div>
              </div>
              <!-- map //-->
              <a name="PflegeMap.top"></a>
              <div class="map small-map medium-map large-map">
                <div id="PflegeMap.map" class="pflegemap-map">
                  <div id="PflegeMap.popup" class="pm-popup">
                    <a href="#" id="PflegeMap.popup-closer" class="pm-popup-closer"></a>
                    <div id="PflegeMap.popup-content">
                      <div id="PflegeMap.popup-title" class="pm-popup-title"></div>
                      <div id="PflegeMap.popup-data"></div>
                      <div id="PflegeMap.popup-functions"class="pm-popup-functions">
                        <div class="pm-popup-function-from"><i class="fa fa-flag-o fa-lg fa-fw"></i>&nbsp; Route von hier</div>
                        <div class="pm-popup-function-to"><i class="fa fa-flag-checkered fa-lg fa-fw"></i>&nbsp; Route nach hier</div>
                        <div class="pm-popup-function-proximity">
                          <div class="pm-popup-function-proximity-search">
                            <i class="fa fa-search fa-lg fa-fw"></i>
                            &nbsp;Umkreis
                          </div>
                          <select id="pm-popup-proximity-select">
                            <option value="-1" selected="selected">--</option>
                            <option value="1000">1km</option>
                            <option value="2000">2km</option>
                            <option value="5000">5km</option>
                            <option value="10000">10km</option>
                            <option value="20000">20km</option>
                            <option value="40000">40km</option>
                          </select>
                        </div>
                        <div class="pm-popup-function-reach">
                          <div class="pm-popup-function-reach-search">
                            <i class="fa fa-search fa-lg fa-fw"></i>
                            &nbsp;Erreichbarkeit
                          </div>
                          <select id="pm-popup-reach-select">
                            <option value="5" selected="selected">5min</option>
                            <option value="10">10min</option>
                            <option value="15">15min</option>
                            <option value="30">30min</option>
                            <option value="45">45min</option>
                            <option value="60">1h</option>
                          </select>
                        </div>
                        <div class="pm-popup-function-clear">
                          <i class="fa fa-times fa-lg fa-fw"></i>&nbsp; Markierung l&ouml;schen
                        </div>
                      </div> <!-- end PflegeMap.popup-functions //-->
                    </div> <!-- end PflegeMap.popup-content //-->
                  </div> <!-- end PflegeMap.popup //-->
                </div> <!-- end PflegeMap.map //-->
              </div>
              <div class="pflegemap-care-service-list small-map medium-map large-map">
                <div class="pm-care-service pm-care-service-header" style="display: block;">
                  Trefferliste im aktuellen Kartenausschnitt:
                </div>
              </div>
              <div class="pflegemap-clear"></div>
              <!-- Liste //-->
              <div id="PflegeMap.careServicesList" class="pflegemap-care-service-list small-map medium-map large-map">
                <div id="PflegeMap.noFeatureMessage" class="pm-care-service" feature_id="0" class="list small-map medium-map large-map">
                  Keine Ergebnisse
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </section>
    <footer>
      <a href="http://kreis-lup.de/#" class="big-button">Raum für Zukunft</a>
    </footer>
  </body>
</html>