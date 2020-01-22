(function($) {
	var today = new Date();
	today = moment(today).format('MM/DD/YYYY');
	var fortnight = moment(today).add(30, 'day').format('MM/DD/YYYY');

	$.getJSON(widget_json, function(data){

		$.each(data['events'], function(i, val) {
			var title = val['title'];
			var description = val['description'];
			description = description.replace(/(<([^>]+)>)/ig,"");
			var location = val['location']['name'];
			var id = val['id'];

			// convert start and end timestamps into readable date and time using moment.js
			var eventDate = val['start'];
			var d = moment(eventDate).format('YYYY-MM-DD');
			var month = moment(eventDate).format('MMMM');
			var year = moment(eventDate).format('YYYY');
			var dayWeek = moment(eventDate).format('dddd');
			var dayNumeric = moment(eventDate).format('D');
			var hour = moment(eventDate).format('h');
			var minute = moment(eventDate).format('mm');
			var ampm = moment(eventDate).format('a');

			// set up end time
			var end = val['end'];
			var endHour = moment(end).format('h');
			var endMinute = moment(end).format('mm');
			var endAmpm = moment(end).format('a');
			var detailsURL = eventURL+id+'&d='+d;
			var image = val['featured_image'];
			var category = val['category'];

			var displayCategory, categoryClass;

			$.each(category, function(k,v) {
				c = v['name'].replace(/\s+/g, '-').replace(/&/g, '').replace('--', '-');
				categoryClass += c+' ';
				categoryClass = categoryClass.replace('undefined', '');

				displayCategory += '<span>'+v['name']+'</span>';
				displayCategory = displayCategory.replace('undefined', '');
			});

			if(location != '') {
				var eventLocation = '<div class="event-location"><strong>Location:</strong> '+location+'</div>';
			} else {
				eventLocation = '';
			}

			if(description != '') {
				var eventDescription = '<div class="event-description">'+description+'</div>';
			} else {
				eventDescription = '';
			}

			$('ul.calendar-events').append('<li class="calendar-event '+categoryClass+'" data-id="'+id+'">'+
					'<div class="calendar-event__details-wrapper">'+
						'<div class="event-title">'+title+'</div>'+
						'<div class="event-categories">Tags: '+displayCategory+'</div>'+
						'<div class="event-date">'+dayWeek+', '+month+' '+dayNumeric+', '+year+'</div>'+
						'<div class="event-time"><i class="fa fa-clock-o" aria-hidden="true"></i>'+
						'<span class="start">'+hour+':'+minute+' '+ampm+'</span> - <span class="end">'+endHour+':'+endMinute+' '+endAmpm+'</span>'+
						'</div>'+
						eventLocation+
						eventDescription+
						'<a href="'+detailsURL+'" class="event-btn btn">Read More <i class="fa fa-angle-right" aria-hidden="true"></i></a>'+
					'</div>'+
				'</li>'
			);

			$('.event-description').each(function () {
				var p = $(this).text();
				if(p.length > 200) {
					$(this).text($(this).text().substring(0,150).split(" ").slice(0, -1).join(" ") + ' ...');
				}
			});

		});

		if(current_tag != 'All') {
				if($('.calendar-event.'+current_tag+'').length) {
					$('.calendar-event').hide();
					$('.calendar-event.'+current_tag+'').show();
				} else {
					$('.calendar-event').show();
					$('.selected-category').text('ALL');
				}
			}

	});

	$('.events--date-range').append('<span class="today">'+today+'</span> - <span class="fortnight">'+fortnight+'</span>');

	$('.tag-filter__widget').on('change', function() {
		
		$('.error-message').empty().hide();

		var selectedCategory = $(this).val();
		var displayCategory = $(this).find('option:selected').text();
		if( ($('.'+selectedCategory).length == 0) && (selectedCategory != 'All') ) {
			$('.calendar-event').hide()
			$('.error-message').append('<strong>No events were found with the tag <i>'+displayCategory+'</i>.</strong><div class="error-close"><i class="fa fa-times" aria-hidden="true"></i></div>').slideDown();
			$('.current-category .selected-category').text(displayCategory);
		} else {
			$('.calendar-event').hide();
			$('.calendar-event.'+selectedCategory).show();
			$('.current-category .selected-category').text(displayCategory);
		}

		if(selectedCategory == 'All') {
			$('.calendar-event').show();
			$('.current-category .selected-category').text('All');
		}

	});

	$('.error-message').on('click', '.error-close', function() {
		$('.error-message').empty().hide();
		$('.calendar-event').show();
		$('.current-category .selected-category').text('All');
	});

})(jQuery);
