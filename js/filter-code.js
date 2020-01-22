
        setTimeout(function() {
           
                var currentTags = [];
            $('.control').each(function() {
                var checkbox = $(this).find('input[name="tag"]');
                var sel = checkbox.attr('data-filter');
                checkbox.on('change', function() {
                    countSelectedTags('.tag-filter');
                    var ch = this.checked ? 'yes' : 'no';
                    var display = sel.replace(/-/g, ' ');
                    if (ch == 'yes') {
                        currentTags.push(sel);

                        console.log(currentTags);
                        if (sel != 'all') {
                            

                            if ($('.event').hasClass(sel)) {
                                $('.month-events__wrapper').hide();
                                $('.' + sel).addClass('tag-selected');

                                $('.month-events__wrapper').each(function() {
                                    if ($(this).find('.' + sel).length) {
                                        $(this).addClass('tag-selected').show();
                                    } else {
                                        $(this).removeClass('tag-selected').hide();
                                    }

                                });

                                $('.selected-tags__wrap').show().append('<span class="' + sel + ' selected-tag">' +
                                    display +
                                    '</span>'
                                );
                            } else {
                                $('.event').addClass('hidden');
                            }
                        }
                        if (sel == 'all') {
                            currentTags = [];
                            $('.event').removeClass('hidden').removeClass('tag-selected');
                            $('span.selected-tag').remove();
                            $('.selected-tags__wrap').hide();
                            $('.control').each(function() {
                                $(this).find('input[type="checkbox"]').prop('checked', '');
                            });
                            $('.month-events__wrapper').show();
                        }
                    }
                    if (ch == 'no') {

                        currentTags.splice($.inArray(sel, currentTags), 1);

                        console.log(currentTags);

                        $('span.' + sel).remove();

                        for(i=0;i<currentTags.length;i++) {
                            console.log(currentTags[i]);
                            $('.event').removeClass('tag-selected');
                            
                                if(!$('.event').hasClass('.'+currentTags[i]+'')) {
                                    $('.event.'+sel).removeClass('tag-selected').addClass('hidden');
                                    $('.event.'+currentTags[i]).addClass('tag-selected').removeClass('hidden');

                                    $('.month-events__wrapper').each(function() {
                                        if ($(this).find('.' + currentTags[i]).length) {
                                            $(this).addClass('tag-selected').show();
                                        } else {
                                            $(this).removeClass('tag-selected').hide();
                                        }

                                    });
                                }

                                
                                
                            }
                        }

                });
            });
        }, 100);