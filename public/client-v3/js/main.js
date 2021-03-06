require(
	[ "require"
	, "jquery"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"	]
	, function(require, $) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
    $(function() {
			require(
				[ "lib/conversationContainer" 
				, "lib/messageContainer" 
				, "lib/messageDropZone" ]
				, function (convo, messageContainer, drop) {
					$('#conversationContainer').conversationContainer();
					$('#messages').messageContainer();
					$('#messageDropZone').messageDropZone();
				}
			);
    });
	}
);
