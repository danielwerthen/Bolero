define(
	[ "jquery"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" ]
	, 
	function ($) {
		var centerIndex = 0
			, self = null
			, container = {};

		function _keydown(e) {
			if (e.keyCode === 37) { self.prev(); }
			else if (e.keyCode === 39) { self.next(); }
		}

		function _create() {
			self = this;
			self.element.empty();
			for( var i = -2; i < 3; i++) {
				var item = $('<div />', { id: i });
				item.css( 
					{ 'position': 'absolute'
					, '-webkit-transition-duration': '500ms'
					, '-moz-transition-duration': '500ms'
					, '-o-transition-duration': '500ms'
					, 'opacity': (i == -2 || i == 2 ? 0 : 1 )
					});
				item.data('index', i);
				item.data('dirty', true);
				self.element.append(item);
			}
			$(document).keydown(_keydown);
			$(window).resize(function () {
				self._layout();
				self._render(true);
			});
		}

		function _init() {
			centerIndex = 0;
			self._layout();
			self._render(true);
		}

		function next() {
			if (centerIndex >= self.options.items.length - 1)
				return;
			centerIndex++;
			self.element.children().each(function () {
				var item = $(this)
					, i = item.data('index');
				if (i === -2) {
					item.data('index', 2);
					item.data('dirty', true);
				}
				else {
					item.data('dirty', false);
					item.data('index', item.data('index') - 1);
				}
			});
			self._layout();
			self._render();
		}

		function prev() {
			if (centerIndex === 0)
				return;
			centerIndex--;
			self.element.children().each(function () {
				var item = $(this)
					, i = item.data('index');
				if (i === 2) {
					item.data('index', -2);
					item.data('dirty', true);
				}
				else {
					item.data('dirty', false);
					item.data('index', item.data('index') + 1);
				}
			});
			self._layout();
			self._render();
		}

		function _layout() {
			var width = self.element.width()
				, step = width / 3
				, y = self.options.yPos
				, xOffset = self.options.xOffset;
			step = step < self.options.minStep ? self.options.minStep : step;
			self.element.children().each(function () {
				var item = $(this)
					, i = item.data('index')
					, x = (i + 0.5 ) * step * self.options.xScale + xOffset
					, trans = 'translate(' + x + 'px, ' + y + 'px)';
				item.css({
					'-webkit-transform': trans
					, '-ms-transform': trans
					, '-moz-transform': trans
					, '-o-transform': trans
				});
				if (i === -2 || i === 2)
					item.css({ 'opacity': 0 });
				else
					item.css({ 'opacity': 1 });
				x+=step;
			});
		}

		function _render(refresh) {
			self.element.children().each(function () {
				var item = $(this)
					, i = item.data('index') + centerIndex;
				if (!item.data('dirty') && !refresh)
					return;
				if (i >= 0 && i < self.options.items.length) {
					self.options.render.call(item, self.options.items[i]);
				}
				else {
					item.empty();
				}
				item.attr('id', i);
			});
		}

		function push(data) {
			self.options.items.push(data);
			self.select(self.options.items.length - 1);
		}

		function select(id) {
			if (centerIndex === id)
				return;
			centerIndex = id;
			self._layout();
			self._render(true);
		}

		function _getIdFromUrl() {
			return Number(window.location.hash.replace(/^#\/?/,""));
		}

		container = {
			_create: _create
			, _init: _init
			, _layout: _layout
			, _render: _render
			, next: next
			, prev: prev
			, select: select
			, push: push
			, options: { 
				yPos: 50
				, items: []
				, render: function () { }
				, xScale: 1.0
				, xOffset: 0
				, minStep: 450
			}
		};
		$.widget( "Bolero.smoothContainer"
						, container);
	}
);
