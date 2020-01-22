<?php

function libcal_for_wordpress_display_featured_events($atts) {
	$now = date("Y-m-d");
	$now = strtotime($now);
	$atts = shortcode_atts(
		array(
			'name' => $name,
			'display' => $display,
			'all_events' => $allEvents,
			'category' => $category,
			'calendar_button' => $calendar_button,
			'list_title' => $list_title
		), $atts
	);

	$cid = '8194';

	$display = ($atts['display'] != 'scroll') ? 'grid' : 'scroll';

	$calendar_button = ($atts['calendar_button'] != 'no') ? 'yes' : 'no';

	if($atts['all_events'] == NULL || $atts['all_events'] != 'yes') {
		$feed = 'no';
	} else {
		$feed = 'yes';
	}

	if($display == 'scroll'):
		wp_register_script('iscroll_js', plugins_url().'/libcal-for-wordpress/dist/iScroll.min.js', NULL, true, false);
		wp_register_script('ppl_event_scroll', plugins_url().'/libcal-for-wordpress/dist/ppl-event-scroll.min.js', ['jquery'], $now, false);
		wp_enqueue_script('iscroll_js');
		wp_enqueue_script('ppl_event_scroll');
	endif;

	// get featured events from data base then make a call to the LibCal API to get event data
	
	require_once('token.php');


	if($feed == 'no') {

		$feed_name = $atts['name'];

		global $wpdb;

		$eIDs;
		$event_display;

		$table = $wpdb->prefix.'libcal_featured_events';

		$getIDS = $wpdb->get_results("SELECT * FROM $table WHERE feed_name = '$feed_name'");

		foreach($getIDS as $ids) {
			$id = $ids->event_id;
			$eIDS .= $id .',';
		}

		$eIDS = rtrim($eIDS, ',');
		$cal_url = "https://api2.libcal.com/1.1/events/".$eIDS."";
	
	} else if($feed == 'yes') {
		$cal_url = "https://api2.libcal.com/1.1/events?cal_id=".$cid."&date=".date("Y-m-d")."&limit=30";
	}

$curl = curl_init();

	curl_setopt_array($curl, array(
	  CURLOPT_URL => $cal_url,
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
	
	foreach($events as $event) {
		
		foreach($event as $e) {

			$title = $e['title'];
			$start = date('g:i a', strtotime($e['start']));
			$month = date('M', strtotime($e['start']));
			$day = date('d', strtotime($e['start']));
			$year = date('Y', strtotime($e['start']));
			$urlDate = date('Y-m-d', strtotime($e['start']));
			$eConvert = str_replace('+00', '-05', $e['end']);
			$sConvert = str_replace('+00', '-05', $e['start']);
			$end = date('g:i a', strtotime($eConvert));
			$start_time = date('g:i a', strtotime($sConvert));
			$d = strtotime($e['start']);
			$img = $e['featured_image'];
			$id = $e['id'];
			$description = $e['description'];

			$bg_fallback = 'https://www.provlib.org/wp-content/uploads/2018/02/light-blue_logo_bg.jpg';
			
			if($img != '') {
				$ft_img = '<div class="featured_image" style="background-image:url('.$e['featured_image'].');"></div>';
			} else {
				$ft_img = '<div class="featured_image" style="background-image:url('.$bg_fallback.');"></div>';
			}
			


			if($d >= $now) {
				if($display == 'scroll') {
					$event_display .= '<li class="featured_event">'.
										'<div class="event_date">'.
											'<div>'.$month.'</div>'.
											'<div>'.$day.'</div>'.
											'<div>'.$year.'</div>'.
										'</div>'.
										'</a>'.
									'<div class="event-details__wrapper"><h3><a href="'.get_site_url('url').'/calendar/?id='.$id.'&d='.$urlDate.'" >'.$title.'</a></h3>'.
									'<div class="date"><i class="fa fa-clock-o" aria-hidden="true"></i>'.$start_time .' - ' .$end.'</div>'.
									'<a href="'.get_site_url('url').'/calendar/?id='.$id.'&d='.$urlDate.'" class="event-details-btn">Details <i class="fa fa-angle-right" aria-hidden="true"></i></a></div><a href="'.get_site_url('url').'/calendar/?id='.$id.'&d='.$urlDate.'" >'.$ft_img.'</a></li>';
				} else {
					$event_display .= '<div class="featured_event">'.
									'<a href="'.get_site_url('url').'/calendar/?id='.$id.'&d='.$urlDate.'" >'.$ft_img.'</a>'.
									'<div class="event_date">'.
										'<div>'.$month.'</div>'.
										'<div>'.$day.'</div>'.
										'<div>'.$year.'</div>'.
									'</div>'.
									'<div class="event-details__wrapper">'.
									'<h3><a href="'.get_site_url('url').'/calendar/?id='.$id.'&d='.$urlDate.'" >'.$title.'</a></h3><div class="date"><i class="fa fa-clock-o" aria-hidden="true"></i>'.$start.' - '.$end.'</div><a href="'.get_site_url('url').'/calendar/?id='.$id.'&d='.$urlDate.'" class="event-details-btn">Details <i class="fa fa-angle-right" aria-hidden="true"></i></a></div></div>';
				}
			}

		}
	}

	if($atts['list_title'] != NULL || $atts['list_title'] != ''):
		$list_title = $atts['list_title'];
	else:
		$list_title = 'Upcoming Events';
	endif;

	if($calendar_button != 'no'):
		$cal_btn = '<div class="event-list-full-calendar-btn"><a href="'.get_site_url('url').'/calendar/"> View All Events<span class="right-angle"><i class="fa fa-angle-right" aria-hidden="true"></i></span></a></div>';
	else:
		$cal_btn = '';
	endif;
	
	if($display == 'scroll'):
		return '<div class="event-listing-title">'.$list_title.'</div>'.
				'<div class="featured-events-list__wrapper scrolling">'.
					'<ul id="events-listing">'.
							$event_display.
					'</ul>'.
				'</div>'.
				$cal_btn;
	else:
		return '<div class="event-listing-title">Upcoming Events</div>'.
				'<div class="featured-events__wrapper ' .$display.'">'.
					$event_display.
				'</div>';
	endif;
}


}

function ppl_featured_events_register_shortcode() {

	add_shortcode('featuredEvents', 'libcal_for_wordpress_display_featured_events');
}

add_action('init', 'ppl_featured_events_register_shortcode');

?>