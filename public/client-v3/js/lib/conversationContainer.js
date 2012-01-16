define(
	[ "jquery"
	, "lib/dataEngine" 
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" 
	, "lib/conversation" ]
	, function ($, dataEngine) {
		$.widget( "Bolero.conversationContainer", 
			{_create:
				function () {
					var _self = this;
					dataEngine.emit('getConversations', {}, function (convos) {
						console.log('got conversations');
						_self.load(convos);
					});
				}
			, load:
				function (convos) {
					var _self = this;
					for (var i in convos) {
						var c = $('<div/>').conversation();
						c.conversation('load', convos[i]);
						_self.element.append(c);
					}
				}
	
			});
	}
);
