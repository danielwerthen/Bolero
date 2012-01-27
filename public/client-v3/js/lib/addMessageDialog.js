define(
	[ "jquery"
	, "lib/dataEngine"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" ]
	, function ($, dataEngine) {
		var dialog = {};
		function _create() {
			var self = this;
			self.element.dialog(
				{ modal: true
				, draggable: false
				, resizable: false
				});
		}

		dialog = 
			{ _create: _create };
		$.widget( "Bolero.addMessageDialog"
						, dialog );

		function open() {
			var container = $('<div></div>');
			container.append('<input class="title" type="text" value="What were you thinking!"></input>');
			container.append('<textarea class="message">I ain\'t following you know...</textarea>');
			container.addMessageDialog();
		}

		return {
			open: open
		}
	}
);
