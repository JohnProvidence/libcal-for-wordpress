jQuery(document).ready(function () {
	var $ = jQuery;
	$('.loading').hide();
	$('.toggle-tab').on('click', function() {
		$('.toggle-tab').not(this).removeClass('visible');
		$(this).addClass('visible');

		var sectionId = $(this).attr('data-id');
		$('.lcwp-admin__section').hide();
		$('#'+sectionId).show()
	});

	$('.featured_event').each(function() {
		var chbox = $(this).find('.checkbox').find('input[type="checkbox"]');

		chbox.on('change', function() {
			var val = this.checked ? 'yes' : 'no'; 
			if(val == 'yes') {
				$(this).siblings('input[type="hidden"]').removeAttr('disabled');
			}
			if(val == 'no') {
				$(this).siblings('input[type="hidden"]').attr('disabled', 'disabled');
			}
			
		});
	});
	
	$(window).scroll(function() {
		var scroll = $(window).scrollTop();

		if(scroll >= 200) {
			$('fieldset.submit').addClass('fixed');
		} else {
			$('fieldset.submit').removeClass('fixed');
		}
	});

	$('form.featured_events_form').on('submit', function( e ) {

		$(this).addClass('hidden');
		$('.loading').fadeIn();

		var formData = [];

		e.preventDefault();

		var feed_name = $(this).find('input[name="feed_name"]').val();

		$.each($('.featured_event'), function() {
			var chbox = $(this).find('.checkbox').find('input[type="checkbox"]');
			if(chbox.is(':checked')) {
				var date = $(this).find('input[name="event_date[]"]').val();
				var title = $(this).find('input[name="event_title[]"]').val();
				var id = $(this).find('input[name="event_id[]"]').val();

				formData.push({event_date: date, event_title: title, event_id: id, feed_name: feed_name});
			}
			
		
		});
		

		$.ajax({
			type: 'post',
			data: {
				action: 'libcal_get_events',
				data: formData
			},
			url: ajaxurl,
			success: function(response) {
				$('.loading').hide();
				$('form.featured_events_form').removeClass('hidden');
				alert('Your events were submitted. Cool!');
			}
		});

	});

	$('.view-selected-events').on('click', function() {
		$('form.featured_events_form, form.delete_events').addClass('hidden');
		$('.feed_list .list li').remove();
		$(this).addClass('selected');
		$('.select-events').removeClass('selected');
		$('.loading').fadeIn();

		$('fieldset.event_delete').remove();
		$.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'libcal_feed_list'
			},
			success: function(data) {
				$('.loading').hide();
				//$('form.feed').prepend(data).removeClass('hidden');
				console.log(data);
				$('.feed_list .list').prepend(data);
				$('.feed_list').removeClass('hidden');
			}
		})
	});

	$('.select-events').on('click', function() {
		$('.loading').fadeIn();
		$(this).addClass('selected');
		$('.view-selected-events').removeClass('selected');
		$('form.delete_events').addClass('hidden');
		$('form.featured_events_form').removeClass('hidden');
		$('.loading').hide();
	})

	$('form.delete_events').on('change', '.delete', function() {
		var val = this.checked ? 'yes' : 'no'; 

		console.log(val);

		if(val == 'yes') {
			$(this).siblings('input[type="hidden"]').removeAttr('disabled');
		}
		if(val == 'no') {
			$(this).siblings('input[type="hidden"]').attr('disabled', 'disabled');
		}
	})


	$('form.delete_events').on('submit', function(e) {
		e.preventDefault();
		
		$(this).addClass('hidden');
		formData = [];
		
		$('.loading').show();
		
		var feed_name = $(this).find('input[name="feed_name"]').val();
		
		$('form.delete_events fieldset.event_delete').each(function() {
			var chbox = $(this).find('input[type="checkbox"]');
			
			if(chbox.is(':checked')) {
				var id = $(this).find('input[name="event_id"]').val();
				
				formData.push({event_id: id, feed_name: feed_name});
			}
		});

		$.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'libcal_remove_featured_events',
				ids: formData
			},
			success: function(data) {
				
				$('fieldset.event_delete').remove();

				$.ajax({
					type: 'POST',
					url: ajaxurl,
					data: {
						action: 'libcal_selected_events',
						fn: feed_name
					},
					success: function(data) {
						$('.loading').hide();
						$('form.delete_events').prepend(data);
						$('form.delete_events').removeClass('hidden');
					}
				});


			}
		});


	});

	$('.delete_old_events').on('click', function() {
		$('.loading').show()
		$.ajax({

			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'libcal_clear_past_events'
			},
			success: function(data) {
				$('.loading').hide();
				console.log(data);
			}

		});
	});

	$('.feed_list').on('click', '.delete_feed', function() {
		var feed_name = $(this).siblings('input[name="feed_name"]').val();
		var fn = [];
		$('.loading').show();
		$('.feed_list').addClass('hidden').find('.list li').remove();
		fn.push({feed_name: feed_name});
		$.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'libcal_delete_feed',
				fn: fn
			},
			success: function(data) {
				
				$.ajax({
					type: 'POST',
					url: ajaxurl,
					data: {
						action: 'libcal_feed_list'
					},
					success: function(data) {
						$('.loading').hide();
						$('.feed_list .list').prepend(data);
						$('.feed_list').removeClass('hidden');
					}
				});
			
			}
		});

	});

	$('.feed_list').on('click', '.edit_feed', function() {
		var feed_name = $(this).siblings('input[name="feed_name"]').val();
		var fn = [];
		$('.loading').show();
		$('.feed_list').addClass('hidden').find('.list li').remove();
		fn.push({feed_name: feed_name});

		$.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'libcal_selected_events',
				fn: feed_name
			},
			success: function(data) {
				$('form.delete_events').prepend(data).removeClass('hidden');
				$('.loading').hide();
			}
		})
	});

	$('.feed_list').on('click', '.add_to_feed', function() {
		var feed_name = $(this).siblings('input[name="feed_name"]').val();

		$('.loading').show();
		$('.feed_list').addClass('hidden');

		$('form.featured_events_form').removeClass('hidden');
		$('form.featured_events_form').find('fieldset.submit input[type="text"]').val(feed_name);
		$('.loading').hide();
	});

});





