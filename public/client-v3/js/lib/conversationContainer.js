define(
	[ "jquery"
	, "lib/dataEngine" 
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" 
	, "lib/conversation" ]
	, function ($, dataEngine) {
		$.widget( "Bolero.conversationContainer", 
			{ _create:
				function () {
					var self = this;
					dataEngine.emit('getConversations', {}, function (convos) {
						console.log('got convos');
						self.load(convos);
					});
				}
			, load:
				function (convos) {
					console.log('works');
					for (var i in convos) {
						var c = $('<div></div>').conversation();
						c.conversation('load', convos[i]);
						this.element.append(c);
					}
				}
	
			});
	}
);
