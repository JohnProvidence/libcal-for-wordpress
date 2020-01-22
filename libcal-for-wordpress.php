<?php
/**
* Plugin Name: Library Event Calendars 
* Plugin URI: https://github.com/ppldev/ppl-event-calendar
* Description: A simple plugin that pulls LibCal events from the LibCal API for the purposes of creating event calendar widgets and a full event calendars.
* Version: 1.0
* Author: John Bent 
* License: GPL2
* License URI: https://www.gnu.org/licenses/gpl-2.0.html
* */

function libcal_event_feed_install() {

	global $wpdb, $wnm_db_version; 

	$charset_collate = $wpdb->get_charset_collate();

	$event_table = $wpdb->prefix . 'library_events';
	$library_details_table = $wpdb->prefix . 'library_information';
	$event_tags_table = $wpdb->prefix . 'libcal_tags';
	
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php');
		

	$sql = " CREATE TABLE IF NOT EXISTS $event_tags_table (
	id int(9) NOT NULL AUTO_INCREMENT,
	tag varchar(150) NOT NULL,
	PRIMARY KEY (id)
	) $charset_collate;";

	dbDelta( $sql );

}

register_activation_hook(__FILE__, 'libcal_event_feed_install');

// Load plugin functions from inc directory
function loadDep($type, $file) {
	$file_base = 'inc/'.$type.'/';
	include($file_base.$file.'.php');
}

$admin = array(
	'load_scripts',
	'admin_menu',
	'admin_main_page',
	'admin_tags',
	'admin_featured_events'
	);

foreach($admin as $a) {
	loadDep('admin', $a);
} 

$display = array(
	'load_scripts',
	'event_feed_widget',
	'event_feed_full',
	'featured_events_display'
);

foreach($display as $d) {
	loadDep('display', $d);
}




?>