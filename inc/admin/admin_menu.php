<?php
// Add plugin to admin menu and add admin page and sub-pages

add_action('admin_menu', 'libcal_for_wordpress_admin_menu');

function libcal_for_wordpress_admin_menu() {
	add_menu_page('Library Calendars', 'Library Calendars', 'manage_options', 'library-calendars', 'libcal_for_wordpress_calendar_admin', 'dashicons-calendar-alt');
}

add_action('admin_menu', 'libcal_for_wordpress_submenu_pages');

function libcal_for_wordpress_submenu_pages() {

	/*add_submenu_page('library-calendars', 'Category Tags', 'Category Tags', 'manage_options', 'edit-category-tags', 'libcal_for_wordpress_edit_category_tags');*/

	add_submenu_page('library-calendars', 'Featured Events', 'Featured Events', 'manage_options', 'edit-feature-events', 'libcal_for_wordpress_edit_featured_events');
	
}


?>