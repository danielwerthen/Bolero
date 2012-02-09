$(function () {
	var page = $('.page')
		, articles = page.find('article')

	function layout() {
		var width = page.width()
			, height = page.height()
			, ta = page.find('.top article')
			, tc = Math.min(articles.length, Math.max(1, Math.floor(width / 200)))
		ta.each(function (i) {
			var item = $(this);
			if (i >= tc)
				item.css('display', 'none');
			else {
				item.css({
					'display': 'inline-block',
					'width': Math.floor(100 / tc - (tc > 2 ? 1.5 : 3)) + '%'
				});

			}
		});
	}
	layout();
	$(window).resize(layout);
});
