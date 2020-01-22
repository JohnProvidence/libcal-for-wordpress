<?php

function libcal_for_wordpress_edit_featured_events() {


	$start = date("Y-m-d");

	require_once('token.php');

	require_once('get_events.php');

	$upcoming_events;

	foreach($events as $event) {
		foreach($event as $e) {
			$e_id = $e['id'];
			$e_title = $e['title'];
			$e_start = $e['start'];
			$img = $e['featured_image'];
				$bg_fallback = 'https://www.provlib.org/wp-content/uploads/2018/02/light-blue_logo_bg.jpg';
			
			if($img != '') {
				$ft_img = '<div class="featured_image" style="background-image:url('.$e['featured_image'].');"></div>';
			} else {
				$ft_img = '<div class="featured_image" style="background-image:url('.$bg_fallback.');"></div>';
			}

			$upcoming_events .= '<fieldset class="featured_event">'.
									$ft_img.
								'<div class="event_title">'.$e_title.'</div>'.
								'<div class="event_date">'.date('m-d-Y', strtotime($e_start)).'</div>'.
								'<div class="checkbox">'.
								'<label>Feature This Event? '.
								'<input type="checkbox" name="featured[]" />'.
								'<input type="hidden" name="event_id[]" value="'.$e_id.'" disabled="disabled"/>'.
								'<input type="hidden" name="event_title[]" value="'.$e_title.'" disabled="disabled"/>'.
								'<input type="hidden" name="event_date[]" value="'.$e_start.'" disabled="disabled" />'.
								'</label>'.
								'</div>'.
								'</fieldset>';

		}
	}

?>
<div class="lcwp-calendar__featured-events">
	<h1>Featured Programs &amp; Events</h1>
	
	<button class="delete_old_events">Clear Past Events From Database</button>

	<div class="select-events selected">Create a Feed</div>
	<div class="view-selected-events">View Current Feeds</div>
	
	<form method="POST" class="featured_events_form">
		<h2>Create a New Feed:</h2>
		<?php echo $upcoming_events; ?>

		<fieldset class="submit">
			<input type="text" name="feed_name" placeholder="Enter a nickname for this feed..." class="feed_name" required/>
			<input type="submit" value="Submit Feed" />
		</fieldset>

	</form>

	<div class="feed_list">
		<h2>Current Feeds:</h2>
		<ul class="list">
		</ul>
	</div>

	<form method="POST" class="delete_events hidden">
		<fieldset class="submit">
			<input type="submit" value="Delete Events" />
		</fieldset>
	</form>

	<div class="loading">
		<div class="loader"></div>
	</div>
</div>
<?php

}

function plugin_ajaxurl() {

   echo '<script type="text/javascript">
           var ajaxurl = "' . admin_url('admin-ajax.php') . '";
         </script>';
}

add_action('wp_ajax_libcal_get_events', 'libcal_for_wordpress_featured_events_submit');
add_action('wp_ajax_nopriv_get_events', 'libcal_for_wordpress_featured_events_submit');

function libcal_for_wordpress_featured_events_submit() {
		
		$data = $_POST['data'];
		


		for($i=0;$i<count($data);$i++) {
			
			$event_title = sanitize_text_field($data[$i]['event_title']);
			$event_date = $data[$i]['event_date'];
			$event_id = $data[$i]['event_id'];
			$feed_name = sanitize_text_field($data[$i]['feed_name']);

			str_replace(' ', '-', $feed_name);
			
			global $wpdb;

			$table = $wpdb->prefix.'libcal_featured_events';

			$id_check = $wpdb->get_results("SELECT * FROM $table WHERE event_id = $event_id AND feed_name = $feed_name");
			

			$results = count($id_check);
			var_dump($results);

			if($results <= 0) {

			$success =$wpdb->insert($table, array('event_id' => $event_id, 'event_date' => $event_date, 'event_title' => $event_title, 'feed_name' => $feed_name));

				if($success) {
					echo $event_title . ' has been added as a featured event.<br>';
				} else {

				}
			}
		}

		wp_die();
}

add_action('wp_ajax_libcal_selected_events', 'libcal_for_wordpress_get_selected_events');
add_action('wp_ajax_nopriv_selected_events', 'libcal_for_wordpress_get_selected_events');

function libcal_for_wordpress_get_selected_events() {

	$feed_name = $_POST['fn'];

	sanitize_text_field($feed_name);

	global $wpdb;

	$x;

	$table = $wpdb->prefix.'libcal_featured_events';

	$getEvents = $wpdb->get_results("SELECT * FROM $table");

	foreach($getEvents as $e) {
		$eID = $e->event_id;
		$eDate = $e->event_date;
		$eDate = date('m/d/y | g:i a', strtotime($eDate));
		$eTitle = $e->event_title;
		$fn = $e->feed_name;
		if($feed_name == $fn) {
			$x .= '<fieldset class="event_delete">'.
					'<span class="title">'.$eTitle.'</span>'.
					'<span class="date">'.$eDate.'</span>'.
					'<label>Remove Event from Featured?</lable>'.
					'<input type="checkbox" name="delete_event" class="delete" />'.
					'<input type="hidden" value="'.$eID.'" name="event_id" disabled="disabled"/>'.
					'<input type="hidden" value="'.$fn.'" name="feed_name" disabled="disabled" />'.
					'</fieldset>';
		}

	}

	echo $x;	
	wp_die();	
}

add_action('wp_ajax_libcal_remove_featured_events', 'libcal_for_wordpress_remove_featured_events');
add_action('wp_ajax_nopriv_libcal_remove_featured_events', 'libcal_for_wordpress_remove_featured_events');

function libcal_for_wordpress_remove_featured_events() {
	$data = $_POST['ids'];

	foreach($data as $d) {
		$eID = $d['event_id'];
		$fn = $d['feed_name'];

		global $wpdb;

		$table = $wpdb->prefix.'libcal_featured_events';

		$delete = $wpdb->delete($table, array('event_id'=> $eID, 'feed_name' => $fn));

		if($delete) {
			echo "Events were removed from the featured events list";
		}
	}
	wp_die();
}

add_action('wp_ajax_libcal_clear_past_events', 'libcal_for_wordpress_clear_past_events');
add_action('wp_ajax_nopriv_libcal_clear_past_events', 'libcal_for_wordpress_clear_past_events');

function libcal_for_wordpress_clear_past_events() {
	// clear events from database on button click
	global $wpdb;
	$table = $wpdb->prefix.'libcal_featured_events';

	$now = date("Y-m-d g:i a");
	$now = strtotime($now);

	$getDates = $wpdb->get_results("SELECT * FROM $table");

	foreach($getDates as $date) {
		
		$thisDate = $date->event_date;
		$thisTitle = $date->event_title;
		$thisDate = strtotime($thisDate);

		if($thisDate < $now) {
			$delete = $wpdb->delete($table, array('event_title' => $thisTitle));

			if($delete) {
				echo $thisTitle .' has been deleted from the database';
			}
		}
	}
	wp_die();
}

add_action('wp_ajax_libcal_feed_list', 'libcal_for_wordpress_feed_list');
add_action('wp_ajax_nopriv_libcal_feed_list', 'libcal_for_wordpress_feed_list');

function libcal_for_wordpress_feed_list() {

	$feeds = array();

	$thisFeed;

	global $wpdb;
	$table = $wpdb->prefix.'libcal_featured_events';

	$list = $wpdb->get_results("SELECT DISTINCT feed_name FROM $table");

	foreach($list as $fn) {
		if($fn->feed_name != ''):
			$thisFeed .= '<li class="feed">'.
							'<span class="feed_title">'.stripslashes($fn->feed_name).'</span>'.
							'<input type="hidden" name="feed_name" value="'.$fn->feed_name.'">'.
							'<button class="delete_feed">Delete Feed</button>'.
							'<button class="edit_feed">Remove Events From Feed</button>'.
							'<button class="add_to_feed">Add Events</button>'.
							'<span class="shortcode_display"><code>[featuredEvents name="'.$fn->feed_name.'"][/featuredEvents]</code></span>'.
						'</li>';
		endif;
	}

	echo $thisFeed;
	wp_die();

}

add_action('wp_ajax_libcal_delete_feed', 'libcal_for_wordpress_delete_feed');
add_action('wp_ajax_nopriv_libcal_delete_feed', 'libcal_for_wordpress_delete_feed');

function libcal_for_wordpress_delete_feed() {

	$feed = $_POST['fn'];

	$feed_name = stripslashes($feed[0]['feed_name']);
	$feed_name = sanitize_text_field($feed_name);

	global $wpdb;

	$table = $wpdb->prefix.'libcal_featured_events';

	$delete = $wpdb->delete($table, array('feed_name'=> $feed_name));

	if($delete) {
		echo $feed_name . ' was deleted from the database';
	} else {
		echo 'error';
	}

	wp_die();

}

?>