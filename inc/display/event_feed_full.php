<?php
// Full calendar display
// This page uses a json feed generated from a cron task. The task files the index.php file in the full-calendar folder. This generates the json file, cal.json, which feeds the events to the calendar. 

function libcal_for_wordpress_full_calendar_display() {

	$curr_date = date("F j, Y, g:i a");  
	$cache_date = strtotime($curr_date);

	wp_register_script('moment_js', plugins_url().'/libcal-for-wordpress/dist/moment.min.js', ['jquery'], true, null);
	wp_register_script('underscore_js', plugins_url().'/libcal-for-wordpress/dist/underscore.min.js', ['jquery'], true, null);
	wp_register_script('clndr_js', plugins_url().'/libcal-for-wordpress/dist/clndr.min.js', ['jquery'], true, null);
	wp_enqueue_script('moment_js'); // load moment.js
	wp_enqueue_script('underscore_js');
	wp_enqueue_script('clndr_js');
	
	// for local debugging - comment out before pushing
	//wp_register_script('libcal_for_wordpress_full_calendar_js', plugins_url().'/libcal-for-wordpress/js/full-calendar.js', ['jquery'], true, null);

	wp_register_script('libcal_for_wordpress_full_calendar_js', plugins_url().'/libcal-for-wordpress/dist/full-calendar.min.js', ['jquery'], $cache_date, null);


	wp_enqueue_script('libcal_for_wordpress_full_calendar_js'); // load full-calendar.js

	global $wpdb;

	$tags_table = $wpdb->prefix.'libcal_tags';

	$tags_query = $wpdb->prepare("SELECT tag FROM $tags_table", RID);

	$tag_rows = $wpdb->get_results( $tags_query );

	sort($tag_rows);

	$tags_array = array();

	foreach($tag_rows as $t):

		$tags_array[] = array(

			'tag' => $t->tag
		);

	endforeach;

	// html generated when shortcode is called

	$uploads = wp_upload_dir();
	$upload_path = $uploads['baseurl'];
	
	$cal_json = $upload_path.'/calendar-feeds/full.json';
	$tags_json = plugin_dir_url(__DIR__).'/full-calendar/tags.json';
	$site_url = get_site_url() . '/calendar/?id=';

	return '
		<div class="calendar-title">
			<h2>Upcoming Events at Providence Public Library</h2>
			<div class="calendar-toggle__wrapper">
				<button class="calendar-show"><span>Display Calendar</span> <i class="fa fa-calendar"></i>
				<i class="fa fa-angle-down"></i>
				<i class="fa fa-angle-up hidden"></i>
				</button>
			</div>
		</div>
		<div class="calendar-wrapper">
			<div class="toggle-filters"><i class="fa fa-calendar" aria-hidden="true"></i> Full Calendar <i class="fa fa-angle-up" aria-hidden="true"></i></div>
        <div class="controls__wrapper">
		<div id="calendar"></div><!-- #calendar -->
            <button id="previous-year" class="btn"><i class="fa fa-angle-left" aria-hidden="true"></i> Previous Year</button>
            <button id="next-year" class="btn">Next Year <i class="fa fa-angle-right" aria-hidden="true"></i></button>
        </div><!-- .controls__wrapper -->
       <div class="day-btns">
       		<div class="btn yesterday"><i class="fa fa-angle-left" aria-hidden="true"></i> Yesterday</div>
       		<div class="btn tomorrow">Tomorrow <i class="fa fa-angle-right" aria-hidden="true"></i></div>


       </div>

       <div class="tag-filter__label">Filter by tag</div>

                <div class="tag-filter">
                      <div class="tag-control"><label class="control">
                      	<input name="tag" id="tag_0" class="tag_select" data-filter="all" type="checkbox">
                      	<div class="tag-control__label btn tag-btn">All Events</div></label></div>
               
        </div>
            
        <div class="selected-tags__wrap"><span>Showing Events Tagged: </span></div>   
      <div class="calendar-info__wrapper">
	      <div id="date-display__wrapper"></div>
	      <div id="events-list__wrapper"></div>
	      <div id="single-event__wrapper"></div>
      </div>
  </div>'.

		'<script>'.
			'var cal_json ="'.$cal_json.'";'.
			'var tags_json ='.json_encode($tags_array).';'.
			'var site_url = "'.$site_url.'";'.
		'</script>';

	


}

function ppl_full_calendar_register_shortcode() {

	add_shortcode('fullCalendar', 'libcal_for_wordpress_full_calendar_display');
}

add_action('init', 'ppl_full_calendar_register_shortcode');

?>