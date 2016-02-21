<?php
  $config = parse_ini_file('config.ini', true);
#  header ('Content-type: application/json; charset=utf-8');
#  $service_url = 'http://gdi-service.de:8888/Osm2poService';
  $service_url = $config['router']['url'];
  $content = @file_get_contents($service_url . '?' . $_SERVER['QUERY_STRING']);
  if ($content === false) {
    echo "#Fehler: 404
Der Service " . $service_url . " ist derzeit nicht erreichbar";
  }
  else {
    echo $content;
  }
?>