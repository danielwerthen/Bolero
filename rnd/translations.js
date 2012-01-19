
var center
	, currentConversation;
$.widget( "Bolero.messagebox" 
				, {
		_init: function () {
			var self = this
				, items = this.options.items;
			center = 0;
			self.element.children().html('');
			for(var i = -2; i <= (items.length > 2 ? 2 : items.length); i++)
			{
				if (i < 0) {
					$('#' + i, self.element).data('index', i);
				}
				else {
					$('#' + i, self.element).data('index', i).html(items[i]);
				}
			}
		}
		, next: function () {
			var self = this
				, items = this.options.items;
			if (center >= items.length - 1)
				return;
			center++;
			self.element.children().each(function () {
				var s = $(this);
				if (s.hasClass('pos1')) {
					s.removeClass('pos1').addClass('pos5');
					var index = center + 2;
					s.data('index', index);
					if (index >= 0 && index < items.length)
						s.html(items[index]);
					else
						s.html('');
				}
				else if (s.hasClass('pos2'))
					s.removeClass('pos2').addClass('pos1');
				else if (s.hasClass('pos3'))
					s.removeClass('pos3').addClass('pos2');
				else if (s.hasClass('pos4'))
					s.removeClass('pos4').addClass('pos3');
				else if (s.hasClass('pos5'))
					s.removeClass('pos5').addClass('pos4');
			});
		}
		, prev: function () {
			var self = this
				, items = this.options.items;
			if (center === 0)
				return;
			center--;
			self.element.children().each(function () {
				var s = $(this);
				if (s.hasClass('pos1'))
					s.removeClass('pos1').addClass('pos2');
				else if (s.hasClass('pos2'))
					s.removeClass('pos2').addClass('pos3');
				else if (s.hasClass('pos3'))
					s.removeClass('pos3').addClass('pos4');
				else if (s.hasClass('pos4'))
					s.removeClass('pos4').addClass('pos5');
				else if (s.hasClass('pos5')) {
					s.removeClass('pos5').addClass('pos1');
					var index = center - 2;
					s.data('index', index);
					if (index >= 0 && index < items.length)
						s.html(items[index]);
					else
						s.html('');
				}
			});
		}
	});

$(function () {
	console.log('useing plugin');
	$('.smoothContainer').smoothContainer({
		items: 
			[ 'message 1'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'Would you?'
			, 'I didnt think so!'
			, 'No, seriously'
			, 'Listen'
			, 'saying hello'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'Would you?'
			, 'I didnt think so!'
			, 'No, seriously'
			, 'Listen'
			, 'saying hello'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'Yeah, thats right'
			, 'What do you know?!' ]
		, yPos: 100
		, render: function (data) {
			var item = $(this);
			item.html(data);
		}
	});
	$(document).keydown(function (e) {
		if (e.keyCode === 38)
			$('#sc').smoothContainer({ items: [1,2,3,4,5] });
	});
	/*$('.messageContainer').messagebox({ 
		items: 
			[ 'message 1'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'Would you?'
			, 'I didnt think so!'
			, 'No, seriously'
			, 'Listen'
			, 'saying hello'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'Would you?'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'Would you?'
			, 'saying hello'
			, 'saying hello'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'Would you?'
			, 'I didnt think so!'
			, 'No, seriously'
			, 'Listen'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'Would you?'
			, 'I didnt think so!'
			, 'No, seriously'
			, 'Listen'
			, 'I didnt think so!'
			, 'No, seriously'
			, 'Listen'
			, 'I didnt think so!'
			, 'No, seriously'
			, 'Listen'
			, 'Would you?'
			, 'I didnt think so!'
			, 'No, seriously'
			, 'Listen'
			, 'what do you think'
			, 'I think this might work'
			, 'Fibes, oh Fibes!'
			, 'What do you know?!'
			, 'Run to the end'
			, 'Yeah, thats right'
			, 'What do you know?!'
			, 'Love child is '
			, 'I would know'
			, 'Would you?'
			, 'I didnt think so!'
			, 'No, seriously'
			, 'Listen'
			]	
	});*/
	/*$('.messageContainer').messagebox({ 
		items: 
			[ 'message 1'
			, 'saying hello'
			, 'what do you think'
			]	
	});*/
	/*function next() {
		$('.messageContainer').messagebox('next');
	}
	function prev() {
		$('.messageContainer').messagebox('prev');
	}

	$(document).keydown(function (e) {
		console.log(e.type + ' : ' + e.which);
		if (e.keyCode === 37 && e.shiftKey) {
			prev();
		}
		if (e.keyCode === 39) {
			next();
		}
	});*/
});
