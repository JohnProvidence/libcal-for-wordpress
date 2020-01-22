<?php
// Load admin styles and scripts

function libcal_for_wordpress_wp_admin_styles() {

	wp_register_style('libcal_for_wordpress_admin_css',  plugins_url().'/libcal-for-wordpress/style.css', array(), true, null);
	wp_enqueue_style('libcal_for_wordpress_admin_css');

}

add_action( 'admin_enqueue_scripts' , 'libcal_for_wordpress_wp_admin_styles');

function libcal_for_wordpress_wp_admin_scripts() {
	wp_register_script('libcal_for_wordpress_admin_js', plugins_url().'/libcal-for-wordpress/js/lcwp-admin.js', ['jquery'], true, null);
	wp_enqueue_script('libcal_for_wordpress_admin_js');
}

add_action('admin_enqueue_scripts', 'libcal_for_wordpress_wp_admin_scripts');

?>