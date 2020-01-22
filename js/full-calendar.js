(function($) {
    // get 
    var getID = function getID(sParam) {
        var calURL = decodeURIComponent(window.location.search.substring(1)),
            URLVariables = calURL.split('&'),
            paramName,
            i;

        for (i = 0; i < URLVariables.length; i++) {
            paramName = URLVariables[i].split('=');

            if (paramName[0] === sParam) {
                return paramName[1] === undefined ? true : paramName[1];
            }

        }
    };

    $('.calendar-show').on('click', function() {
        $('.controls__wrapper').slideToggle(400).toggleClass('opened');
        var txt = $('.controls__wrapper').hasClass('opened') ? 'Hide Calendar' : 'Display Calendar';
        var arrow = $('.controls__wrapper').hasClass('opened') ? 'fa-angle-down' : 'fa-angle-up';
        $('.calendar-show').find('span').text(txt);
        $('.calendar-show i.fa-angle-down, .calendar-show i.fa-angle-up').toggleClass('hidden');
    });

    

    var ID = getID('id');
    var d = getID('d');

    if (typeof(d) != 'undefined' && d != null) {
        d = moment(d).format('YYYY-MM-DD');
    } else {
        d = moment().format('YYYY-MM-DD');
    }

    var appended = false;

    // variables 
    var startDate = d;
    var month = moment(startDate).format('MMM');
    var year = moment(startDate).format('YYYY');
    var currentDay = moment(startDate).format('DD');
    var selectedDate;
    var title, date, location, day, year, month, description, image, presenter, startTime, endTime, categoryClass, displayCategory, monthLong, theCalendarInstance, img;
    // empty array to pass events to use in clndr instance
    var events = [];

    function yesterday_tomorrow(date) {
        var y = moment(date).subtract(1, 'day').format('YYYY-MM-DD');
        var t = moment(date).add(1, 'day').format('YYYY-MM-DD');
        $('.btn.yesterday').attr('data-date', y);
        $('.btn.tomorrow').attr('data-date', t);

    }

    function uniqueArray(array) {
        var result = [];
        $.each(array, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
    }

    $('.tag-filter, .selected-tags__wrap').hide();

    $('.tag-filter__label').on('click', function() {
        $('.tag-filter').slideToggle(400);
        $(this).toggleClass('expanded');
    });

    function loadTags(el) {

        $.each(tags_json, function(i, val) {
            var controlClass = val['tag'].replace(/\s+/g, '-');
            controlClass = controlClass.replace('\'', '').replace('&', '').replace('--', '-');
            $(el).append(
                '<div class="tag-control">' +
                '<label class="control">' +
                '<input type="checkbox" name="tag" id="tag_' + i + '" class="tag_select" data-filter="' + controlClass + '">' +
                '<div class="tag-control__label btn tag-btn">' + val['tag'] + '</div></label></div>'
            );
        });

    }
    loadTags('.tag-filter');

    // count tags 
    function countSelectedTags(el) {
        $(el).each(function() {
            var amountChecked = $(this).find('input[type="checkbox"]:checked').length;
            if (amountChecked == 0) {
                $('.month-events__wrapper .events .event').show();
                $('.month-events__wrapper').show();
            }
        });
    }
    // disable tags that are not in use in the current array of events displayed
    function disableTags(el) {
        $(document).ready(function() {
            setTimeout(function() {

                $(el).each(function() {
                    var checkbox = $(this).find('input[name="tag"]')
                    var tag = checkbox.attr('data-filter');
                    checkbox.attr('disabled', 'disabled');
                    if ($('.event').length) {
                        if ($('.event').hasClass(tag) || tag == 'all') {
                            checkbox.removeAttr('disabled');
                        }
                    }
                });
            }, 1000);
        });
    }
    // clear details from screen prior to loading new events
    function clearDetails() {
        $('#events-list__wrapper, #date-display__wrapper, #single-event__wrapper').hide().empty();
    }
    // display error message if no events are found
    function noEvents(date, days) {
        switch (days) {
            case false:
                date = moment(date).format('MMMM YYYY');
                break;
            case true:
                date = moment(date).format('dddd, MMMM DD, YYYY');
                break;
        }
        var message = setTimeout(function() {
            $('#events-list__wrapper').append('<h2 class="no-events">No events scheduled for ' + date + '</h2>').slideDown(400);
            return false;
        }, 400);

    }
    // generate variable to format date/time information
    function formatTime(val) {
        var date = val['start'];
        date = moment(date).format('YYYY-MM-DD');
        startTime = new Date(val['start']);
        var hh = startTime.getHours();
        var min = startTime.getMinutes();
        var ampm = (hh >= 12) ? 'pm' : 'am';
        hh = hh % 12;
        hh = hh ? hh : 12;
        hh = hh < 10 ? +hh : hh;
        min = min < 10 ? '0' + min : min;
        var time = hh + ':' + min + ' ' + ampm;
    }

    // append event information to list
    function eventDetails(val, time) {

        var img;
        if (val['image'] != 'undefined' && val['image'] != '') {
            img = '<div class="img"><img src="' + val['image'] + '" alt="' + val['title'] + '" /></div>';
        } else {
            img = '';
        }
        setTimeout(function() {

            var categoryClass = '';
            var displayCategory = '';

            $.each(val['category'], function(k, v) {
                if(val['category'].length) {
                    c = v['name'].replace(/\s+/g, '-');
                    c = c.replace('\'', '').replace('-&-', '-');
                    categoryClass += c + ' ';
                    displayCategory += '<span>' + v['name'] + '</span>';
                }
            });

            var location = val['location']['name'];

            if (typeof(location) != 'undefined' && location != '') {
                var eventLocation = '<div class="event-location"><strong>Location:</strong> ' + location + '</div>';
            } else {
                eventLocation = '';
            }
            var eventDate = val['start'];
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
            var image = val['featured_image'];
            var category = val['category'];
            var location = val['location']['name'];

            var description;

            if(val['description'].length >= 200) {
                description = val['description'].substring(0, 250).split(" ").slice(0, -1).join(" ") + ' ...';
            } else {
                description = val['description'];
            }

            $('#events-list__wrapper').append(
                '<div class="event ' + categoryClass + '">' +
                '<h2>' + val['title'] + '</h2>' +
                '<div class="tags"><span><strong>Tags:</strong> </span>' + displayCategory + '</div>' +
                '<div class="event-time"><i class="fa fa-clock-o" aria-hidden="true"></i>' +
                '<span class="start">' + hour + ':' + minute + ' ' + ampm + '</span> - <span class="end">' + endHour + ':' + endMinute + ' ' + endAmpm + '</span>' +
                '</div>' +
                eventLocation +
                '<div class="description">' + description + '</div>' + img +
                '<div class="event-details__button btn" data-id="' + val['id'] + '"><a href="' + site_url + '' + val['id'] + '&d=' + val['date'] + '">Details <i class="fa fa-angle-right"></i></a></div>' +
                '</div>'
            ).slideDown(400);
        }, 400);
    }


    // load events 
    function loadEvents(newDate, theCalendarInstance) {
        newDate = moment(newDate).format('YYYY-MM-DD');
        eventsThisMonth = theCalendarInstance['eventsThisInterval'];

        month = moment(newDate).format('MMM');
        year = moment(newDate).format('YYYY');
        day = moment(newDate).startOf('month').format('DD');
        setTimeout(function() {
            $('#date-display__wrapper').append(
                '<div class="month">' + month + '</div>' +
                '<div class="day">' + day + '</div>'
            ).fadeIn(400);
        }, 400);
        // check the amount of events this interval in the calendar instance array
        if (eventsThisMonth.length) {
            $.each(eventsThisMonth, function(i, val) {
                time = val['startTime'];
                if (date == newDate) {
                    setTimeout(function() {
                        sortCategories(val);
                        if (val['featured_image'] != 'undefined') {
                            var img = '<div class="img"><img src="' + val['featured_image'] + '" alt="' + val['title'] + '" /></div>';
                        } else {
                            img = '';
                        }
                        eventDetails(val, time);
                    }, 400);
                }
            })
        } else {
            noEvents(newDate, false);
        }
    }


    function displayDate(mm, dd) {
        
        clearDetails();
        $('#date-display__wrapper').empty();
        setTimeout(function() {
            $('#date-display__wrapper').append(
                '<div class="month">' + mm + '</div>' +
                '<div class="day">' + dd + '</div>'
            ).fadeIn(400);
        }, 400)
    
    }

    $.getJSON(cal_json, function(data) {

        $.each(data['events'], function(i, val) {
            var eventDate = val['start'];
            var date = moment(eventDate).format('YYYY-MM-DD');
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
            var category = val['category'];
            var location = val['location']['name'];
            var description = val['description'];
            description = description.replace(/(<([^>]+)>)/ig,"");

            events.push({
                id: val['id'],
                title: val['title'],
                date: date,
                allday: val['allday'],
                start: val['start'],
                end: val['end'],
                startTime: hour + ':' + minute + ' ' + ampm,
                endTime: endHour + ':' + endMinute + ' ' + endAmpm,
                category: category,
                description: description,
                image: val['featured_image'],
                future_dates: val['future_dates'],
                location: location,
                presenter: val['presenter'],
                registration: val['registration'],
                seats: val['seats'],
                seats_taken: val['seats_taken'],
                url: val['url']['public'],
                waitlist: val['wait_list']
            });

        }); // end $.getJSON 

        // Generate clndr object and pass events

        var theCalendarInstance = $('#calendar').clndr({
            startWithMonth: startDate,
            classes: {
                past: 'past',
                today: 'today',
                event: 'has-events',
                selected: 'selected',
                inactive: 'inactive',
                lastMonth: 'last-month',
                nextMonth: 'next-month',
                adjacentMonth: 'adjacent-month'
            },
            dateParameter: 'date',
            events: events,
            adjacentDaysChangeMonth: false,
            clickEvents: {
                click: function(target) {
                    var thisDate = target['date']['_i'];
                    var day = moment(thisDate).format('D');
                    var month = moment(thisDate).format('MMM');
                    var monthLong = moment(thisDate).format('MMMM');

                    displayDate(month, day);

                    yesterday_tomorrow(thisDate);
                    $('.tag-filter__label').hide();

                    if (target.events.length) {
                        $('.day-btns').show();
                        $.each(target.events, function(i, val) {

                            var time = val['startTime'];

                            if (val['allday'] == true) {
                                time = 'All day event';
                            }
                            eventDetails(val, time);
                            disableTags('.control');
                            $('.tag-filter').addClass('hidden');
                            $('.tag-filter__label').removeClass('expanded');
                        });
                    } else {
                        noEvents(thisDate, true);
                    }
                    $('.controls__wrapper').removeClass('visible');
                },
                onMonthChange: function(month) {
                    $('.day-btns').hide();
                    $('.tag-filter__label').show();
                    var thisMonth = month['_d'];
                    var days = [];
                    var eventsThisMonth = theCalendarInstance['eventsThisInterval'];
                    selectedMonth = moment(thisMonth).format('YYYY-MM');
                    displayMonth = moment(thisMonth).format('MMM');
                    clearDetails();
                    if (eventsThisMonth.length) {

                        $.each(eventsThisMonth, function(i, val) {
                            var dates = val['date'];
                            dates = moment(dates).format('YYYY-MM');
                            month = moment(dates).format('MM');
                            eventDays = moment(val['date']).format('DD');
                            days.push(eventDays);
                            days = uniqueArray(days);
                        });

                        $.each(days, function(a, d) {

                            $('#events-list__wrapper').append(
                                '<div class="month-events__wrapper" data-day="' + d + '" data-month="' + selectedMonth + '">' +
                                '<div class="date-display__wrapper">' +
                                '<div class="month">' + displayMonth + '</div>' +
                                '<div class="day">' + d + '</div>' +
                                '</div>' +
                                '<div class="events"></div>' +
                                '</div>'
                            );

                            $.each(eventsThisMonth, function(i, val) {
                                var eventDate = val['date'];
                                eventDate = moment(eventDate).format('YYYY-MM');
                                eventDay = moment(val['date']).format('DD');
                                if (eventDay == d && eventDate == selectedMonth) {
                                    var time = val['startTime'] + ' - ' + val['endTime'];
                                    if (val['allday'] == true) {
                                        time = 'All day event';
                                    }
                                    setTimeout(function() {
                                        var img;
                                        if (val['image'] != 'undefined' && val['image'] != '') {
                                            img = '<div class="img"><img src="' + val['image'] + '" alt="' + val['title'] + '" /></div>';
                                        } else {
                                            img = '';
                                        }
                                        var categoryClass = '';
                                        var displayCategory = '';
                                        $.each(val['category'], function(k, v) {
                                            c = v['name'].replace(/\s+/g, '-');
                                            c = c.replace('\'', '').replace('-&-', '-');
                                            categoryClass += c + ' ';
                                            displayCategory += '<span>' + v['name'] + '</span>';
                                        });
                                        var location = val['location']['name'];
                                        var description;
                                        
                                        if(val['description'].length >= 200) {
                                            description = val['description'].substring(0, 250).split(" ").slice(0, -1).join(" ") + ' ...';
                                        } else {
                                            description = val['description'];
                                        }

                                        if (typeof(location) != 'undefined' && location != '') {
                                            var eventLocation = '<div class="event-location"><strong>Location:</strong> ' + location + '</div>';
                                        } else {
                                            eventLocation = '';
                                        }

                                        $('.month-events__wrapper[data-day="' + d + '"] .events').append(
                                            '<div class="event ' + categoryClass + '">' +
                                            '<h2>' + val['title'] + '</h2>' +
                                            '<div class="tags"><span><strong>Tags:</strong> </span>' + displayCategory.replace('undefined', '') + '</div>' +
                                            '<div class="start-time"><i class="fa fa-clock-o"></i>' + time + '</div>' +
                                            eventLocation +
                                            '<div class="description">' + description + '</div>' +
                                            img +
                                            '<div class="event-details__button btn" data-id="' + val['id'] + '"><a href="' + site_url + '' + val['id'] + '&d=' + val['date'] + '">Details <i class="fa fa-angle-right"></a></i></div>' +
                                            '</div>'
                                        );
                                    }, 400);
                                }

                            });

                        });
                        $('#events-list__wrapper').slideDown(400);
                        disableTags('.control');
                        $('.tag-filter').addClass('hidden');
                        $('.tag-filter__label').removeClass('expanded');


                    } else {
                        noEvents(thisMonth, false)
                    }
                    $('.controls__wrapper').removeClass('visible');
                }
            },
            ready: function() {

                if ((typeof(ID) != 'undefined' && ID != null) && (typeof(d) != 'undefined' && d != null)) {


                    $('#events-list__wrapper, #date-display__wrapper').hide();

                    loadSingleEvent(ID, d);

                } else {
                    $('#date-display__wrapper').hide();
                    $('.tag-filter__label').show();
                    $('.day-btns').hide();
                    var eventsThisMonth = this['eventsThisInterval'];
                    var days = [];
                  
                   $.each(eventsThisMonth, function(i, val) {
                    var eventDate = moment(val['date']).format('YYYY-MM-DD');
                    selectedMonth = moment(eventDate).format('YYYY-MM');
                    displayMonth = moment(eventDate).format('MMM');
                    
                        if(eventDate >= startDate) {
                             var dates = val['date'];
                            dates = moment(dates).format('YYYY-MM');
                            month = moment(dates).format('MM');
                            eventDays = moment(val['date']).format('DD');
                            days.push(eventDays); 
                            days = uniqueArray(days);

                        }
                    
                    
                   });

                   $.each(days, function(a,d) {
                        $('#events-list__wrapper').append(
                            '<div class="month-events__wrapper" data-day="' + d + '" data-month="' + selectedMonth + '">' +
                            '<div class="date-display__wrapper">' +
                            '<div class="month">' + displayMonth + '</div>' +
                            '<div class="day">' + d + '</div>' +
                            '</div>' +
                              '<div class="events"></div>' +
                            '</div>'
                                );
                

                   $.each(eventsThisMonth, function(i, val) {
                        
                        var eventDate = val['date'];
                        eventDate = moment(eventDate).format('YYYY-MM');
                        eventDay = moment(val['date']).format('DD');
                        if (eventDay == d && eventDate == selectedMonth) {
                            var time = val['startTime'] + ' - ' + val['endTime'];
                            if (val['allday'] == true) {
                                time = 'All day event';
                            }
                            setTimeout(function() {

                                var img;
                                if (val['image'] != 'undefined' && val['image'] != '') {
                                    img = '<div class="img"><img src="' + val['image'] + '" alt="' + val['title'] + '" /></div>';
                                } else {
                                    img = '';
                                }

                                var categoryClass = '';

                                var displayCategory = '';
                                $.each(val['category'], function(k, v) {
                                    c = v['name'].replace(/\s+/g, '-');
                                    c = c.replace('\'', '').replace('-&-', '-');
                                    categoryClass += c + ' ';
                                    displayCategory += '<span>' + v['name'] + '</span>';
                                });

                                var location = val['location'];
                                var description;

                                
                                if(val['description'].length >= 200) {
                                   description = val['description'].substring(0, 250).split(" ").slice(0, -1).join(" ") + ' ...';
                                } else {
                                    description = val['description'];
                                }
    
                                if (typeof(location) != 'undefined' && location != '') {
                                    var eventLocation = '<div class="event-location"><strong>Location:</strong> ' + location + '</div>';
                                } else {
                                    eventLocation = '';
                                }

                                $('.month-events__wrapper[data-day="' + d + '"] .events').append(
                                    '<div class="event ' + categoryClass + '">' +
                                    '<h2>' + val['title'] + '</h2>' +
                                    '<div class="tags"><span><strong>Tags:</strong> </span>' + displayCategory.replace('undefined', '') + '</div>' +
                                    '<div class="start-time"><i class="fa fa-clock-o"></i>' + time + '</div>' +
                                    eventLocation +
                                    '<div class="description">' + description + '</div>' +
                                    img +
                                    '<div class="event-details__button btn" data-id="' + val['id'] + '"><a href="' + site_url + '' + val['id'] + '&d=' + val['date'] + '">Details <i class="fa fa-angle-right"></i></a></div>' +
                                    '</div>'
                                );
                            }, 400)
                        }
                    });
                });
                    $('#events-list__wrapper').slideDown(400);
                    disableTags('.control');
                    $('.tag-filter').addClass('hidden');
                    $('.tag-filter__label').removeClass('expanded');
                }
            }

        });

        // load a month of events
        function loadMonth(newDate, theCalendarInstance) {
            $('.tag-filter__label').show();
            $('.day-btns').hide();
            newDate = moment(newDate).format('YYYY-MM-DD');
            eventsThisMonth = theCalendarInstance['eventsThisInterval'];
            month = moment(newDate).format('MMM');
            year = moment(newDate).format('YYYY');
            day = moment(newDate).startOf('month').format('DD');
            var days = [];
            selectedMonth = moment(newDate).format('YYYY-MM');
            displayMonth = moment(newDate).format('MMM');
            daysInMonth = moment(newDate).daysInMonth();
            if (eventsThisMonth.length) {
                $.each(eventsThisMonth, function(i, val) {
                    var dates = val['date'];
                    dates = moment(dates).format('YYYY-MM');
                    month = moment(dates).format('MM');
                    eventDays = moment(val['date']).format('DD');
                    days.push(eventDays);
                    days = uniqueArray(days);
                });
                $.each(days, function(a, d) {
                    $('#events-list__wrapper').append(
                        '<div class="month-events__wrapper" data-day="' + d + '" data-month="' + selectedMonth + '">' +
                        '<div class="date-display__wrapper">' +
                        '<div class="month">' + displayMonth + '</div>' +
                        '<div class="day">' + d + '</div>' +
                        '</div>' +
                        '<div class="events"></div>' +
                        '</div>'
                    );

                    $.each(eventsThisMonth, function(i, val) {
                        var eventDate = val['date'];
                        eventDate = moment(eventDate).format('YYYY-MM');
                        eventDay = moment(val['date']).format('DD');
                        if (eventDay == d && eventDate == selectedMonth) {
                            var time = val['startTime'] + ' - ' + val['endTime'];
                            if (val['allday'] == true) {
                                time = 'All day event';
                            }
                            setTimeout(function() {

                                var img;
                                if (val['image'] != 'undefined' && val['image'] != '') {
                                    img = '<div class="img"><img src="' + val['image'] + '" alt="' + val['title'] + '" /></div>';
                                } else {
                                    img = '';
                                }

                                var categoryClass = '';

                                var displayCategory = '';
                                $.each(val['category'], function(k, v) {
                                    c = v['name'].replace(/\s+/g, '-');
                                    c = c.replace('\'', '').replace('-&-', '-');
                                    categoryClass += c + ' ';
                                    displayCategory += '<span>' + v['name'] + '</span>';
                                });

                                var location = val['location'];
                                var description;
                                console.log(val['description'].length);
                                if(val['description'].length >= 200) {
                                   description = val['description'].substring(0, 250).split(" ").slice(0, -1).join(" ") + ' ...';
                                } else {
                                    description = val['description'];
                                }

                                if (typeof(location) != 'undefined' && location != '') {
                                    var eventLocation = '<div class="event-location"><strong>Location:</strong> ' + location + '</div>';
                                } else {
                                    eventLocation = '';
                                }

                                $('.month-events__wrapper[data-day="' + d + '"] .events').append(
                                    '<div class="event ' + categoryClass + '">' +
                                    '<h2>' + val['title'] + '</h2>' +
                                    '<div class="tags"><span><strong>Tags:</strong> </span>' + displayCategory.replace('undefined', '') + '</div>' +
                                    '<div class="start-time"><i class="fa fa-clock-o"></i>' + time + '</div>' +
                                    eventLocation +
                                    '<div class="description">' + description + '</div>' +
                                    img +
                                    '<div class="event-details__button btn" data-id="' + val['id'] + '"><a href="' + site_url + '' + val['id'] + '&d=' + val['date'] + '">Details <i class="fa fa-angle-right"></i></a></div>' +
                                    '</div>'
                                );
                            }, 400)
                        }
                    });
                    $('#events-list__wrapper').slideDown(400);
                    disableTags('.control');
                    $('.tag-filter').addClass('hidden');
                    $('.tag-filter__label').removeClass('expanded');
                });
            } else {
                noEvents(newDate, false)
            }
            $('.controls__wrapper').removeClass('visible');
        }

        /*$('#next-year').on('click', function() {
            theCalendarInstance.nextYear().setMonth(0);
            clearDetails();
            var newDate = theCalendarInstance['month']['_d'];
            newDate = moment(newDate).format('YYYY-MM-DD');
            loadMonth(newDate, theCalendarInstance);
            $('.controls__wrapper').removeClass('visible');
        });
        $('#previous-year').on('click', function() {
            theCalendarInstance.previousYear().setMonth(0);
            clearDetails();
            var newDate = theCalendarInstance['month']['_d'];
            newDate = moment(newDate).format('YYYY-MM-DD');
            loadMonth(newDate, theCalendarInstance);
            $('.controls__wrapper').removeClass('visible');
        });*/

        $('.btn.tomorrow, .btn.yesterday').on('click', function() {
            
            var selectedDate = $(this).attr('data-date');
            var eventsToday = [];
            var lastMonth = theCalendarInstance['eventsLastMonth'];
            var thisMonth = theCalendarInstance['eventsThisInterval'];
            var nextMonth = theCalendarInstance['eventsNextMonth'];
            var e = [lastMonth, thisMonth, nextMonth];
            var upcomingEvents = [].concat.apply([], e);
            var displayMonth = moment(selectedDate).format('MMM');
            var displayDay = moment(selectedDate).format('DD');
            

            $.each(upcomingEvents, function(i, val) {
               if (selectedDate == val['date']) {
                    eventsToday.push(val['date']);
                }
            });

            if (eventsToday.length <= 0) {
                displayDate(displayMonth, displayDay);
                noEvents(selectedDate, true);
            }

            if (eventsToday.length) {
                $.each(upcomingEvents, function(i, val) {
                    eventDate = val['date'];
                    if (selectedDate == eventDate) {
                        loadCurrentDate(selectedDate, val);
                    }
                });
                displayDate(displayMonth, displayDay);
            }
            yesterday_tomorrow(selectedDate);

        });
       
    });

    // filter tags
    function filters() {
         
         disableTags('.control');

         var currentTags = [];

            $('.control').each(function() {
                
                var checkbox = $(this).find('input[name="tag"]');
                
                checkbox.on('change', function() {
                     
                     countSelectedTags('.tag-filter');
                     
                     var ch = this.checked ? 'yes' : 'no';
                     var s = $(this).attr('data-filter');
                     var display = $(this).attr('data-filter').replace(/-/g, ' ');
                     if(ch == 'yes') {
                        $('.selected-tags__wrap').show().append('<span class="' + s + ' selected-tag">' +
                                    display +
                                    '</span>'
                                );
                     } 
                     if(ch == 'no') {
                        $('.selected-tags__wrap').find('.'+s+'').remove();
                     }

                     if(!$('.selected-tags__wrap span').length) {
                        $('.selected-tags__wrap').hide();
                     }
                   
                    countSelectedTags('.tag-filter');
                    
                    var events = $('.month-events__wrapper .events');

                    var wrapper = $('.month-events__wrapper');

                    wrapper.fadeOut();
                    events.find('.event').hide();

                    var sel = $('input[name="tag"]:checked').map(function() {
                        return $(this).attr('data-filter');
                    }).get();

                    for(i=0;i<sel.length;i++) {
                        wrapper.each(function() {
                            if($(this).find('.'+sel[i]).length) {
                            $('.month-events__wrapper .events .'+sel[i]).show();
                                $(this).fadeIn();
                            } 
                        });
                            if(sel[i] == 'all') {
                                $('.control').each(function() {
                                    $(this).find('input[type="checkbox"]').prop('checked', '');
                                });
                                events.find('.event').show();
                                wrapper.fadeIn();
                                $('.selected-tags__wrap').hide();
                                $('.selected-tags__wrap .selected-tag').remove();
                            }
                        } 
                        
             });

        });
    }

    function loadCurrentDate(date, val) {
        $('.tag-filter__label, .tag-filter, .selected-tags__wrap').hide();
        $('.day-btns').show();
        eventDate = val['start'];
        var month = moment(eventDate).format('MMMM');
        var displayMonth = moment(eventDate).format('MMM');
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
        var image = val['featured_image'];
        var category = val['category'];
        var location = val['location']['name'];

        var location = val['location']['name'];

        if (typeof(location) && location) {
            var eventLocation = '<div class="event-location"><strong>Location:</strong> ' + location + '</div>';
        } else {
            eventLocation = '';
        }

        setTimeout(function() {

            var categoryClass = '';
            var displayCategory = '';

            $.each(val['category'], function(k, v) {
                c = v['name'].replace(/\s+/g, '-');
                c = c.replace('\'', '');
                categoryClass += c + ' ';
                displayCategory += '<span>' + v['name'] + '</span>';
            });

            var img = val['featured_image'];
            var description;

            if (typeof(img) != 'undefined' && img != '') {
                img = '<div class="img"><img src="' + img + '" alt="' + val['title'] + '" /></div>';
            } else {
                img = '';
            }

            if(val['description'].length >= 200) {
                description = val['description'].substring(0, 250).split(" ").slice(0, -1).join(" ") + ' ...';
            } else {
                description = val['description'];
            }

            $('#events-list__wrapper').append(
                '<div class="event ' + categoryClass + '">' +
                '<h2>' + val['title'] + '</h2>' +
                '<div class="tags"><span><strong>Tags:</strong> </span>' + displayCategory + '</div>' +
                '<div class="event-time"><i class="fa fa-clock-o" aria-hidden="true"></i>' +
                '<span class="start">' + hour + ':' + minute + ' ' + ampm + '</span> - <span class="end">' + endHour + ':' + endMinute + ' ' + endAmpm + '</span>' +
                '</div>' +
                eventLocation +
                '<div class="description">' + description + '</div>' +
                img +
                '<div class="event-details__button btn" data-id="' + val['id'] + '"><a href="' + site_url + '' + val['id'] + '&d=' + val['date'] + '">Details <i class="fa fa-angle-right"></i></a></div>' +
                '</div>'
            ).slideDown(400);
        }, 400);
        disableTags('.control');
        $('.tag-filter').addClass('hidden');
        $('.tag-filter__label').removeClass('expanded');

    } // end loadCurrentDate

    function loadSingleEvent(eventId, d) {

        clearDetails();

        yesterday_tomorrow(d);
        
        $('.tag-filter__label').hide();
        $('.day-btns').hide();
        
        $.getJSON(cal_json, function(data) {

            $.each(data['events'], function(i, val) {

                var id = val['id'];

                eventId = parseInt(eventId);


                if (id == eventId) {

                    var eventDate = moment(val['date']).format('MMMM DD YYYY');

                    startDate = eventDate;


                    var present = val['presenter'];
                    if (present != '') {
                        presenter = '<div class="presenter">' + val['presenter'] + '</div>';
                    } else {
                        presenter = '';
                    }
                    var registration = val['registration'];
                    var totalseats = val['seats'];
                    var seatsTaken = val['seats_taken'];
                    var seatsLeft = (totalseats - seatsTaken) + ' seats available.';

                    if (seatsLeft <= 0) {
                        seatsLeft = 'This event is currently full.';
                    }



                    if (registration == true) {
                        registration = '<div class="registration_required">Registration is required for this event</div>' +
                            '<div class="btn reg-button"><a href="' + val['url']['public'] + '" target="_blank">Register for this event<i class="fa fa-angle-right"></i></a></div>';
                    } else {
                        registration = '';
                    }
                    var img = val['featured_image'];

                    if (typeof(img) != 'undefined' && img != '') {
                        img = '<div class="img"><img src="' + img + '" alt="' + val['title'] + '" /></div>';
                    } else {
                        img = '';
                    }

                    var time = val['startTime'];
                    if (val['allday'] == true) {
                        time = 'All day event';
                    }

                    var eventDate = val['start'];
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
                    var image = val['featured_image'];
                    var category = val['category'];
                    var location = val['location']['name'];
                    var eventURL =  val['url']['public'];
                    var facebookURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURI(eventURL);
                    var twitterURL = 'http://twitter.com/home?status=Check Out:"'+val['title']+'"  '+eventURL+'';

                    if (location != '') {
                        var eventLocation = '<div class="event-location"><strong>Location:</strong> ' + location + '</div>';
                    } else {
                        eventLocation = '';
                    }

                    setTimeout(function() {
                        $('#single-event__wrapper').append(
                            '<div class="event-details">' +
                            '<h2 class="event-title">' + val['title'] + '</h2>' +
                            '<div class="share_event">'+
                                '<span>Share this event: </span><span class="icon facebook" title="Share on Facebook"><a href="'+facebookURL+'" target="_blank"><i class="fa fa-facebook" aria-hidden="true"></i></a></span>'+
                                '<span class="icon twitter" title="Share on Twitter"><a href="'+encodeURI(twitterURL)+'" target="_blank"><i class="fa fa-twitter" aria-hidden="true"></i></a></span>'+
                            '</div>'+
                            '<div class="event_date">' + dayWeek + ', ' + month + ' ' + dayNumeric + ', ' + year + '</div>' +
                            '<div class="event-time"><i class="fa fa-clock-o" aria-hidden="true"></i>' +
                            '<span class="start">' + hour + ':' + minute + ' ' + ampm + '</span> - <span class="end">' + endHour + ':' + endMinute + ' ' + endAmpm + '</span>' +
                            '</div>' +
                            eventLocation +
                            img +
                            '<div class="description">' + val['description'] + '</div>' +
                            registration +
                            '</div>'
                        );
                    }, 400);
                }
            });
        });
        $('#single-event__wrapper').slideDown(400);

    } // end loadSingleEvent


    $(document).ready(function() {
        filters();

        $('.toggle-filters').on('click', function() {
            $('.controls__wrapper').toggleClass('visible');
        });
        $('#previous-year, #next-year').hide();

    });

})(jQuery);