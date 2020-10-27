<?php

function get_data($url){
  $curl = curl_init();

  curl_setopt($curl, CURLOPT_URL, $url);

  $data = curl_exec($curl);

  curl_close($curl);
  
  return $data
}