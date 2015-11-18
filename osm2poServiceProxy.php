<?php
  echo file_get_contents('http://localhost:8888/Osm2poService?' . $_SERVER['QUERY_STRING']);
?>