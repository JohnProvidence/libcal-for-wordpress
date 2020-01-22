<?php

// initialize new cURL call to api to get event data feed using the access token we just generated. 
$cid = '8194';

$curl = curl_init();

curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://api2.libcal.com/1.1/events?cal_id=".$cid."&date=".$start."&days=365&limit=300",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "GET",
	  CURLOPT_HTTPHEADER => array(
	    "authorization: Bearer ".$access_token.""
	  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if($err) {
	echo 'cURL Error#:' . $err;
} else {
	$events = json_decode(trim($response), TRUE);
	//var_dump($events);
}
?>