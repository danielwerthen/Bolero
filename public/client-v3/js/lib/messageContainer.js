define(
	[ 'jquery'
	, 'lib/dataEngine'
	, 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js' 
 	, 'lib/smoothContainer'
	, 'lib/message'	]
	, function ($, dataEngine) {
		var self = null
			, container = {};
		function _create() {
			self = this;
			self.element.addClass('messageContainer');
			self.element.smoothContainer(
				{
					render: _render
					, yPos: 75
					, xScale: 1.5
				});
		}

		function _render(data) {
			var item = $(this);
			item.empty();
			var m = $('<div></div>')
				.message()
				.message('load', data.messageId)
				.appendTo(item);
		}

		function load(conversation) {
			var messages = conversation.messages;
			messages.sort(function (a, b) {
				if (a.linkDate === b.linkDate)
					return 0;
				return a.linkDate >= b.linkDate ? 1 : -1;
			});
			self.element.smoothContainer({ items: messages });
		}

		container = {
			_create: _create
			, load: load
		};


		$.widget( "Bolero.messageContainer"
						, container );
		return {
			load: function (conversation) {
							if (self) {
								self.load(conversation);
							}
							else {
								return false;
							}
						}
		};
	}
);


/*define(
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
);*/
