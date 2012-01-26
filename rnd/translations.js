

$(function () {
	var messages = [ 'Message 1'
		, 'saying hello'
		, 'what do you think'
		, 'I think this might work'
		, 'Fibes, oh Fibes!'
		, 'What do you know?!'
		, 'Run to the end'
		, 'Message 2' ];
	var smooth = $('.smoothContainer').smoothContainer({
		items: messages
		, yPos: 100
		, render: function (data) {
			var item = $(this);
			item.html(data);
		}
	});
	smooth.smoothContainer('push', 'Added');
});
