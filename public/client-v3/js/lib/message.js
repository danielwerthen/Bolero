define(
	[ "jquery"
	, "lib/dataEngine"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" ]
	, function ($, dataEngine) {
		function makeDraggable(element) {
			element.draggable({
				cursorAt: { top: 0, left: -25 }
				, helper: function (event) {
					return $('div class="message-draggable-helper"><h3>Drag!</h3></div>');
				}
			});
		}
		function renderMessage(element, data) {
			element.html('loading');
			dataEngine.emit('getMessage'
				, { messageId: data.messageId }
				, function (message) {
					element.empty();
					$('<textarea>' + message.message + '</textarea>')
						.change(function () {
							var ta = $(this);
							message.message = ta.val();
						})
						.appendTo(element);
					makeDraggable(element);
				}
			);
		}
		var message = {
			load: function (message) {
				var self = this;
				renderMessage(self.element, message);
			}
			, itemify: function () {
				return $('<il class="message-item">' + this.options.data.title + '</il>');
			}
			, _create: function () {
				this.element.addClass('message');
			}
			, options: { data: null }
		};
		$.widget( "Bolero.message"
						, message );
	}
);
