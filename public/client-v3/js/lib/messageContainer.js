define(
	[ "jquery"
	, "lib/dataEngine"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"
 	, "lib/message"	]
	, function ($, dataEngine) {
		var instances = []
			, container = {
			load: function (conversation) {			
							var self = this
								, messages = conversation.messages;
								
							messages.sort(function (a, b) {
								if (a.linkDate === b.linkDate)
									return 0;
								return a.linkDate >= b.linkDate ? 1 : -1;
							});
							self.element.empty();
							for (var i in messages) {
								var m = $('<div></div>'
									, { 'id': i
									})
									.message()
									.message('load', messages[i].messageId)
									.appendTo(self.element);
							}
						}
			, destroy: function () {
								 var i = instances.indexOf(this);
								 if (i != -1) instances.splice(i, 1);
							 }
			, _create: function () {
								 this.element.addClass('messageContainer');
								 instances.push(this);
							 }
		};
		$.widget( "Bolero.messageContainer"
						, container );
		return {
			load: function (conversation) {
							if (instances.length > 0) {
								instances[0].load(conversation);
							}
							else {
								return false;
							}
						}
		};
	}
);
