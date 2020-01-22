# Providence Public Library Event Calendar
A Wordpress plugin that displays LibCal event listings via the LibCal API.

:file_folder: **Codebase** /Users/dcc/Sites/ppldev/wp-content/plugins/libcal-for-wordpress/

#### Plugin Directory Structure
:open_file_folder: - **libcal-for-wordpress**
* :open_file_folder: - **dist** - minified javascript files used in the various shortcode implementations for the various calendar displays. Don't edit these files. Edit the files in the **js** directory. **Gulp** handles converting the files in the **js** directory to minified versions for production.
* :open_file_folder: - **feeds** - These are the files that are used to build the JSON data files that are served to the full calendar and the list display.
  - **full-calendar.php** - build the full calendar data file
  - **rebuild-full-calendar.php** - same as above except this outputs to the browser a log of the event data pulled from the API when the script was run.
  - **rebuild-widget.php** - builds the list display JSON data file file and outputs to the browser a log of the event data pulled from the API when the script was run.
  - **widget.php** - rebuilds the list display JSON data file
* :open_file_folder: - **images** - contains images being used in the WordPress admin area.
* :open_file_folder: - **inc** - All of the scripts containing the functions for both the display and admin areas of the plugin. Each directory also contains a script called **token.php** that contains the curl function used to connect to libcal and pull data from the API.  The **load_scripts.php** file is used to enqueue and css or js files used in the admin or display functions.
  - :open_file_folder: - **admin** - admin functions - all of the scripts that generate display and functionality of the admin pages in the WordPress dashboard.
  - :open_file_folder: - **display** - scripts for the front end display of the Full Calendar, The List Display and The Featured Events row.
* :open_file_folder: - **js** - all javascript files used in the plugin.
  - **clndr.js** - Third party javascript library that generates the calendar navigation on the Full Calendar page.  [Documentation](http://kylestetz.github.io/CLNDR/)
  - **filter-code.js** - some js I was keeping as a reference. This is just the code I was working on that filters events by category tag. This file is just around for reference and can be deleted.
  - **full-caldendar.js** - The jQuery that is used in the full caldendar.
  - **iScroll.js** - javascript library that generates the horozontial scroll bar and calculates the width of the parent container holding all events. This only applies to instances of the Featured Event Row. [Documentation](https://github.com/cubiq/iscroll)
  - **lcwp-admin** - javascript that is used in the libcal-for-wordpress admin areas. Mostly on the Featured Events list section.
  - **moment.js** - javascript library that handles converting date objects into human readable dates. Used widely through out the plugin. [Documentation](https://momentjs.com/)
  - **widget.js** - jQuery used to pull event data into the List Display Widget
* :open_file_folder: - **sass** - SCSS files used to generate the style.css file.
* :open_file_folder: - **index.php** - placeholder index file. This needs to be here but doesn't do anything.
* :open_file_folder: - **libcal-for-wordpress.php** - script that is run when teh plugin is activated. Handles loading all of the scripts in the **inc directory**.

#### Calendar Shortcodes

The plugin generates a few different views of event data pulled out of LibCal. Those displays are all generated using [shortcode](https://github.com/JohnProvidence/Digital-Content-Coordinator-Documentation/blob/master/ProvLib-Shortcodes.md).

Most of the displays of event data are controlled by the shortcodes listed below. Refer to the documentation links for information about those shortcodes and the functions that controll how the event data is displayed.

**Featured Event Row**
:link: [Documentation](https://github.com/JohnProvidence/Digital-Content-Coordinator-Documentation/blob/master/ProvLib-Shortcodes.md#featured-events-row)

**Library Calendar**
:link: [Documentation](https://github.com/JohnProvidence/Digital-Content-Coordinator-Documentation/blob/master/ProvLib-Shortcodes.md#library-calendar)

**Calendar List Display**
:link: [Documentation](https://github.com/JohnProvidence/Digital-Content-Coordinator-Documentation/blob/master/ProvLib-Shortcodes.md#calendar-list-display)

#### Calendar Cron Job

The [Full Calendar](https://provlib.org/calendar) pulls event data from a JSON file. This data file contains events pulled from the LibCal API starting two weeks in the past and going foward one year. LibCal's API limits the amount of events you pull out to 500. So the data file has a maximum of 500 events. PPL tends to add lots of repeating events, so that 500 events usually maxes out around 6 months in the future. The Full Calendar on ProvLib.org does not load any past events beyond two weeks in the past.

That file is generated by a script in the LibCal-For-WordPress directory.  The cron job that generates this file is set-up and run at [Cron-Job.org](https://cron-job.org/en/). Cron-Job.org is a free web service that runs scheduled tasks. You need to have an account to use Cron-Job.org. Currently the Calendar cron jobs are run using an account linked to my ProvLib.org email address. These will need to be set-up under a new account. The cron job for the full calendar is run every two minutes.

You can also manually rebuild the full calendar data file by [visiting this url](http://live-ppldev.pantheonsite.io/wp-content/plugins/libcal-for-wordpress/feeds/full-calendar.php). Alternately, you can also rebuild the data file by using a button in the [Library Calendar Admin](https://www.provlib.org/wp-admin/admin.php?page=library-calendars).

![images/calendar_admin_rebuild_data_file.png](images/calendar_admin_rebuild_data_file.png)

Clicking the **Rebuild File** button above will launch a new browser window that will run the PHP script that builds that data file.  I mostly use this to rebuild the file if an event has been added by the cron job has not run yet.

##### Calendar List Display Cron Job

:link: [Example of the List Display on ProvLib.org](https://www.provlib.org/research-collections/) (_List Display is the Calendar to the right of the top image_).

This also uses a JSON data file pulled from LibCal. This only pulls events from the current date, going forward 30 days. That cron job is also run at Cron-Job.org. This file can also be rebuilt manually in the LibCal calendar admin (_click on the **Calendar Widget JSON** tab_).
