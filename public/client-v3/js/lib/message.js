define(
	[ "jquery"
	, "lib/dataEngine"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" ]
	, function ($, dataEngine) {
		var message = {
			load: function (messageId) {
							var self = this;
							dataEngine.emit('getMessage'
								, { messageId: messageId }
								, function (messageData) {
									$('<h3>' + messageData.title + '</h3>').appendTo(self.element);
									$('<p>' + messageData.message + '</p>').appendTo(self.element);
								});
						}
			, _create: function () {
								 this.element.addClass('message');
							 }
		};
		$.widget( "Bolero.message"
						, message );
	}
);
