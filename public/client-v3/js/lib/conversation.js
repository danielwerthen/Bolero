define(
	[ "jquery"
	, "lib/dataEngine"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" ]
	, function ($, dataEngine) {
		var convo = {
			_create: function () {
								 var self = this;
								 this.element.addClass('conversation');
								 this.element.click(function () {
									 console.log('open ' + self.options.id);
								 });
							 }
			, load: function (conversation) {
								this.element.append('<p>' + conversation.title + '</p>');
								this.options.id = conversation._id;
							}
			, options: {
				id: ""
			}
		};
		$.widget( "Bolero.conversation"
			, convo);
	}
);
