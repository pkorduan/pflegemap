<?php
  $config = parse_ini_file('constant.ini', true);
?>
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
    <link rel="stylesheet" href="styles/css/map.css" type="text/css">
    <link href="3rdparty/FontAwesome/font-awesome.min.css" rel="stylesheet">
    <script src="3rdparty/jQuery/jquery-1.11.2.min.js"></script>
    <script src="3rdparty/OpenLayers/v3.8.2/build/ol-debug.js"></script>
    <script src="3rdparty/proj4js/proj4.js"></script>
    <script src="3rdparty/proj4js/25833.js"></script>
    <script src="javascripts/pflegemap.js"></script>
    <script src="javascripts/models/SearchResult.js"></script>
    <script src="javascripts/models/Angebot.js"></script>    

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
          <div id="logo"><img src="http://kreis-lup.de/export/system/modules/de.sis.lup/resources/images/logo.png"></div>
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
              <div><h3 class="">Pflegeangebote</h3></div>
              <div></div>
            </article>
            <article class="clear row">
              <input class="u-full-width" type="search" id="search" placeholder="Search..." />
              <!--button class="icon"><i class="fa fa-search"></i></button-->
              <!--select class="u-full-width" id="nominatimResponseList" style_="display:none;">
                <option value="Option 1">Questions</option>
                <option value="Option 2">Admiration</option>
                <option value="Option 3">Can I get your number?</option>
              </select-->
              <div id="search_result"></div>
            </article>
            <article class="clear row">
              <div id="list" class="mylist">
                <label>
                  <input id="cb-all-kat" type="checkbox" checked/>
                  <span class="label-body">alle Kategorien</span>
                </label><?php foreach($config['sozialpflege']['kategorie'] AS $key => $value) { ?>
                <label>
                  <input kategorie="<?php echo $value; ?>" class="cb-kat" type="checkbox" checked/>
                  <span class="label-body"><?php echo $key; ?></span>
                </label><?php } ?>
              </div>
            </article>
            <article class="clear row">
              <div class="container">
                <div id="PflegeMap.map" class="Pflegemap.map"></div>
              </div>
              <div id="PflegeMap.coordinates">Projektion ETRS89 / UTM zone 33N</div>
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