define(
	[ "jquery"
	, "lib/dataEngine"
	, "lib/messageContainer"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" ]
	, function ($, dataEngine, messageContainer) {
		var convo = { 
			_create: function () {
				var _self = this;	
				_self.element.addClass('conversation');
				 _self.element.click(function () {
					messageContainer.load(_self.options.conversation);
				});
			}
			, load: function (conversation) {
				var _self = this;
				_self.options.conversation = conversation;
								
				var buttonIndicator = $("<div />").addClass("conversationSelectionIndicator");		
				var buttonText = $("<p />").text(conversation.title).addClass("conversationText");
					
				_self.element.append(buttonIndicator);
				_self.element.append(buttonText);
				
			}
			, options: {
				conversation: null
			}
		};
		$.widget( "Bolero.conversation"
			, convo);
	}
);
