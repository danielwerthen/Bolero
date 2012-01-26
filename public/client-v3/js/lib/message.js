define(
	[ "jquery"
	, "lib/dataEngine"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" ]
	, function ($, dataEngine) {
		var message = {
			load: function (messageId) {
				var self = this;
				self.element.html('loading');
				dataEngine.emit('getMessage'
					, { messageId: messageId }
					, function (messageData) {
						self.options.data = messageData;
						self.element.empty();
						$('<h3>' + messageData.title + '</h3>').appendTo(self.element);
						$('<p>' + messageData.message + '</p>').appendTo(self.element);
						self.element.draggable({
							cursorAt: { top: 0, left: -25 }
							, helper: function (event) {
								return $('<div class="message-draggable-helper"><h3>' + messageData.title + '</h3></div>');
							}
						});
					});
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
