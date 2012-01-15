define(
	[ "jquery"
	, "lib/dataEngine"
	, "lib/messageContainer"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" ]
	, function ($, dataEngine, messageContainer) {
		var convo = {
			_create: function () {
								 var self = this;
								 this.element.addClass('conversation');
								 this.element.click(function () {
									 messageContainer.load(self.options.conversation);
								 });
							 }
			, load: function (conversation) {
								this.element.append('<p>' + conversation.title + '</p>');
								this.options.conversation = conversation;
							}
			, options: {
				conversation: null
			}
		};
		$.widget( "Bolero.conversation"
			, convo);
	}
);
