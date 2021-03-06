<?php
// This script pulls calendar events from the libcal API and generates a JSON file to be used in the calendar widget
$token = ''; // establish a variable to hold the LibCal API access token generated by curl_exec
$curl = curl_init(); // initalize cURL

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
  echo "cURL Error #:" . $err; // error reporting, in case there is an issue with getting credentials
} else {
  $token = json_decode($response); // decode json response from libcal, pass array to variable
  $access_token = $token->access_token; // access token in array, pass to variable
}

$cid = '8194'; // libcal calendar id

// intialize curl to connect to API to get event feed
$curl = curl_init();

	curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://api2.libcal.com/1.1/events?cal_id=".$cid."&days=30&limit=100", // get 30 days of events, with a limit of 25 events total from calendar number 8194.
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "GET",
	  CURLOPT_HTTPHEADER => array(
	    "authorization: Bearer ".$access_token."" // pass variable holding access token 
	  ),
	));

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
	  echo "cURL Error #:" . $err; // error reporting, just in case
	} else {
	  
	  $events = json_decode(trim($response), TRUE); // get response from cURL call, trim JSON response, pass to events variable

	}
	

$event_json = json_encode($events); // encode event data as JSON
// uncomment below to debug / view data pulled from api
//var_dump($event_json); 

$fp = fopen('../../../uploads/calendar-feeds/widget.json', 'w'); // open widget.json file, located in the uploads/calendar-feeds folder
fwrite($fp, $event_json); // overwrite file
fclose($fp); // save file to uploads, close

echo '<h2>The widget JSON file was successfully generated.</h2>';
echo '<hr>';

print '<pre>';
print_r($events);
print '</pre>';

?>