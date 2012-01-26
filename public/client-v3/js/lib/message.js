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
			if (data.editable) {
				$('<h3><input type="text" value="Title"></input></h3').appendTo(element);
				$('<p><textarea>Enter your message here!</textarea></p>').appendTo(element);
				makeDraggable(element);
			}
			else {
				element.html('loading');
				dataEngine.emit('getMessage'
					, { messageId: data.messageId }
					, function (message) {
						element.empty();
						$('<h3>' + message.title + '</h3>').appendTo(element);
						$('<p>' + message.message + '</p>').appendTo(element);
						makeDraggable(element);
					}
				);
			}
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
