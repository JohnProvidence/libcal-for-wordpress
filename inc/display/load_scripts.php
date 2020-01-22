<?php

function libcal_for_wordpress_enqueue_scripts_styles() {

	$curr_date = date("F j, Y, g:i a");  
	$cache_date = strtotime($curr_date);
	
	wp_register_style('libcal_for_wordpress_css',  plugins_url().'/libcal-for-wordpress/style.css', array(), $cache_date, null);
	wp_enqueue_style('libcal_for_wordpress_css');
	
	wp_register_style('libcal_for_wordpress_fonts', plugins_url().'/libcal-for-wordpress/css/proxima_nova.css', false, null);
	wp_enqueue_style('libcal_for_wordpress_fonts');

	wp_register_style('font_awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css', false, null);
	wp_enqueue_style('font_awesome');

}

add_action('wp_enqueue_scripts', 'libcal_for_wordpress_enqueue_scripts_styles');

?>