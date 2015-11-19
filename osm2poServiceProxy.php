<?php
#  header ('Content-type: application/json; charset=utf-8');
  $service_url = 'http://localhost:8888/Osm2poService';
  $content = @file_get_contents($service_url . '?' . $_SERVER['QUERY_STRING']);
  if ($content === false) {
    echo "#Fehler: 404
Der Service " . $service_url . " ist derzeit nicht erreichbar";
  }
  else {
    echo $content;
  }
?>