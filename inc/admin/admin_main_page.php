<?php
// Library Details
date_default_timezone_set('america/new_york');
function libcal_for_wordpress_calendar_admin() {
	// Output displayed on the admin page in Wordpress
	
	//$protocol = 'http:';
	

	$dir = wp_upload_dir();

	function lastModified($file) {
		$m = date("h:i:s a m/d/Y", filemtime($file));
		echo $m;
	}
	
	$uploads = wp_upload_dir();
	$upload_path = $uploads['baseurl'];
	
	$full = $upload_path.'/calendar-feeds/full.json';
	$widget = $upload_path.'/calendar-feeds/widget.json';
?>
	<div class="lcwp-calendar__admin">

		<h1>LibCal For WordPress</h1>
		
		<div class="tab-content__wrapper">
			
			<div class="tabs">
				<span class="toggle-tab visible" data-id="about">About This Plugin</span>
				<span class="toggle-tab" data-id="full-calendar">Full Calendar JSON</span>
				<span class="toggle-tab" data-id="calendar-widgets">Calendar Widget JSON</span>
			</div>

			<div id="about" class="lcwp-admin__section visible">
				<p>The events that show up in the full calendar and the calendar widgets are generated by the LibCal API. You can review the LibCal API <a href="https://provlib.libcal.com/admin_api.php" target="_blank">here</a>.</p>

				<h3>Calendar Widgets</h3>
				<p>Calendar widgets can be added in pages, posts, and in page builder rows and modules using shortcode. Calendar widgets pull events over the next 30 days, starting from the current date. </p>
				
				<p><strong>Example: </strong><code>[Calendar][/Calendar]</code></p>
				
				<p>The calendar widget uses event categories to filter events. Event categories are set in LibCal. You can add categories to use for filtering in the calendar widget <a href="" target="_blank">here</a>.</p>

				<h3>Full Calendar</h3>
				<p>This plugin can also display a Full Calendar, which displays 1 year worth of events, with up to 500 events loaded from the LibCal API. To add a Full Calendar simply add the shortcode below.</p>

				<p><strong>Example: </strong><code>[fullCalendar][/fullCalendar]</code></p>

				<p>Both the Widget and Full Calendar use a JSON file to load Calendar events. You can find instructions on rebuilding the JSON feeds by clicking the JSON tabs above.</p>
				

				<p>The Full Calendar display makes use of the following Javascript libraries:</p>
					<ol>
						<li><a href="http://kylestetz.github.io/CLNDR/">CLNDR.js</a> - the library that powers the calendar display</li>
						<li><a href="http://underscorejs.org/">Underscore.js</a> - provides filtering and mapping functionality that is used by CLNDR.js</li>
						<li><a href="https://momentjs.com/">Moment.js</a> - simplifies the process of formatting dates with Javascript</li>
					</ol>
					<p>Please refer to the developer websites for those libraries if there are any issues with one of the above dependencies.</p>
				
			</div>

			<div id="full-calendar" class="lcwp-admin__section">
				<p>The JSON data file for the full event calendar is generated by a cron-job being run through cron-job.org.</p>
				<p>
					<a class="admin-btn">View cron-job logs</a>
				</p>
				<h3>Location of the Full Calendar JSON file:</h3>
					<p><strong>JSON file location:</strong> <?php echo $full; ?> | <strong>Last Modified:</strong> <?php lastModified($dir['basedir'].'/calendar-feeds/full.json'); ?>
				</p>
				<p>
					<a class="admin-btn" href="<?php echo plugins_url().'/libcal-for-wordpress/feeds/rebuild-full-calendar.php'; ?>" target="_blank">Rebuild File</a>
				</p>

			</div>

			<div id="calendar-widgets" class="lcwp-admin__section">
				<p>The JSON data file for the calendar widget is generated by a cron-job being run through cron-job.org.</p>
				
				<p>
					<a class="admin-btn">View cron-job logs</a>
				</p>

				<h3>Location of the Widget JSON file:</h3>
					<p>
						<strong>JSON file location:</strong> <?php echo $widget; ?> | <strong>Last Modified:</strong> <?php lastModified($dir['basedir'].'/calendar-feeds/widget.json'); ?>
				</p>
				<p>
					<a class="admin-btn" href="<?php echo plugins_url().'/libcal-for-wordpress/feeds/rebuild-widget.php'; ?>" target="_blank">Rebuild File</a>
				</p>
			</div>
		
		</div>
	
	</div>
<?php
}