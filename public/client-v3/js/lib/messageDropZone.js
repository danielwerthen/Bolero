define(
	[ "jquery"
	, "lib/dataEngine"
	, "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js" ]
	, function ($, dataEngine) {
		var zone = {
			_create: function () {
				var self = this;
				self.element.addClass('messageDropZone');
				self.element.droppable({
					accept: '.message'
					, drop: function (event, ui) {
						self.element.append(ui.draggable.message('itemify'));
						console.log('got dropped');
					}
				});
			}
		};
		$.widget( "Bolero.messageDropZone"
						, zone );
	}
);
