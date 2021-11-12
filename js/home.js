$(document).ready(function() {
	function calcWelcomeHeight() {
		let padding = $('.header').outerHeight();
		$('.welcome').css('margin-top', `-${padding}px`);
		if ($(window).width() == 1050) {
			$('.welcome').css('margin-top', `-98.7031px`);
		}
	}
	setTimeout(calcWelcomeHeight, 10);
	$(window).on('resize', calcWelcomeHeight);
});