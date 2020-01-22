<?php
// Output feed and generate shortcode(s)

function libcal_for_wordpress($atts) {    // generate the html code to embed in the page, post, sidebar, etc...
	$curr_date = date("F j, Y, g:i a");  
	$cache_date = strtotime($curr_date);
	/**
	* Variable definitions -
	* $tag = default tag set in short code, loads all events with that tag on page load
	*/

	// load calendar widget dependencies only when this function is called to prevent script conflicts
	wp_register_script('moment_js', plugins_url().'/libcal-for-wordpress/dist/moment.min.js', ['jquery'], $cache_date, null);
	wp_enqueue_script('moment_js'); // load moment.js

	wp_register_script('libcal_for_wordpress_widget_js', plugins_url().'/libcal-for-wordpress/dist/widget.min.js', ['jquery'], $cache_date, null);
	
	wp_enqueue_script('libcal_for_wordpress_widget_js');

	$atts =  shortcode_atts(array (
		'tag' => ''
	), $atts);

	if($atts['tag'] == '') {
		$atts['tag'] = 'All';
	}
	$tag = $atts['tag'];
	$display_tag = str_replace('-', ' ', $atts['tag']);

	$tag = str_replace('&', '', $tag);
	$tag = str_replace('--', '-', $tag);
		
	$tags_nav;

	// get tags from database
	
	global $wpdb;

	$tags_table = $wpdb->prefix . 'libcal_tags';

	$tags_query = $wpdb->prepare("SELECT tag FROM $tags_table", 'RID');

	$tag_rows = $wpdb->get_results( $tags_query );

	sort($tag_rows);

	foreach($tag_rows as $t):
		$slugify = str_replace(' ', '-', $t->tag);
		$slugify = str_replace('&', '', $slugify);
		$slugify = str_replace('--', '-', $slugify);
		$tags_nav .= '<option value="'.$slugify.'">'.$t->tag.'</option>';
	endforeach;


	$uploads = wp_upload_dir();
	$upload_path = $uploads['baseurl'];

	$widget_json = $upload_path.'/calendar-feeds/widget.json';

	return '<div class="calendar-widget__wrapper"><div class="calendar-widget__header">
			<h3><i class="fa fa-calendar" aria-hidden="true"></i> Event Calendar</h3>
			<p>Upcoming events at Providence Public Library | <span class="events--date-range"></span>	
			<div class="calendar-filter__wrapper">
				<label>Filter by tag: </label>
				<select class="tag-filter__widget">
					<option disabled="disabled"> -- Filter by category -- </option>
					<option value="All">All Events</option>
					'.$tags_nav.'
				</select>
				<div class="current-category"><i>Current tag:</i> <span class="selected-category">'.strtoupper($display_tag).'</span></div>
			</div>
		
		</div><!-- end .calendar-widget__header -->

		<div class="calendar-widget__feed">
			<div class="error-message"></div>
			<ul class="calendar-events">
			</ul>
		</div><!-- end .calendar-widget__feed -->

		<div class="full-calendar__cta">
			<a href="'.get_site_url().'/calendar" class="btn cta">View Calendar <i class="fa fa-angle-right"></i></a>
		</div><!-- end .full-calendar__cta -->
	
	</div>'.

	

	'<script>
		var widget_json = "'. $widget_json.'";
		var eventURL ="'.get_site_url().'/calendar?id=";'.
		'var current_tag = "'. $tag . '";'.
	'</script>';
	
	
}

function libcal_for_wordpress_register_shortcodes() {

	add_shortcode('Calendar', 'libcal_for_wordpress');
}

add_action('init', 'libcal_for_wordpress_register_shortcodes');

?>