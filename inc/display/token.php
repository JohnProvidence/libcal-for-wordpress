<?php
$token = ''; // establish variable to assign to the access token generated by the curl_exec
$curl = curl_init(); // initialize cURL

curl_setopt_array($curl, array( 
  // options array - connect to libcal, generate token using libcal credentials
  CURLOPT_URL => "https://api2.libcal.com/1.1/oauth/token",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\"grant_type\":\"client_credentials\",\"client_id\": \"93\",\"client_secret\": \"88955ec58432897fd01a2c58ea2e87b8\"}",
  CURLOPT_HTTPHEADER => array(
    "content-type: application/json"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  $token = json_decode($response); // decode json response from libcal, pass array to variable
  $access_token = $token->access_token; // access token in array, pass to variable
}

/******** uncomment below to see generated access token ********/
  //var_dump($access_token); 

?>