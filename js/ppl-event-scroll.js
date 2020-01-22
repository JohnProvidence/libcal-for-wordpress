var myScroll;
var $ = jQuery;
document.addEventListener('DOMContentLoaded', function() {

	var totalWidth = 0;
	$('#events-listing li').each(function(){
		var elWidth = $(this).outerWidth(true);
		console.log(elWidth);
		totalWidth += elWidth;
	});
	$("#events-listing").css('width', totalWidth);

	myScroll = new IScroll('.featured-events-list__wrapper.scrolling', {
		scrollbars: 'custom',
		interactiveScrollBars: true,
		scrollX: true,
		resizeScrollbars: false,
		disablePointer: true,
		disableTouch: false,
		disableMouse: false,
		preventDefault: false,
	});
	console.dir(myScroll.options);

}, false);