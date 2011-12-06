$.widget( "TestNamespace.menuModule", {
	// default options
	options: {
		o: null
		},
	
	// the constructor
	_create: function() {
					
		var submitButton = this.newMenuItem("Load", function() { 
			amplify.publish(messages.thought.update);
		});

		var createButton = this.newMenuItem("Create", function() { 
			amplify.publish(interface.messages.openCreateView);
		});
		
		var buttonContainer = create("div").addClass("menuItemsContainer");
		
		buttonContainer.append(submitButton);
		buttonContainer.append(createButton);
		
		this.element.append(buttonContainer);
			
		this._refresh();
	},
	newMenuItem: function(title, clickCallback){
		var button = create("div").addClass("menuButton");
		var buttonIndicator = create("div").addClass("menuSelectionIndicator");		
		var buttonText = create("p").text(title).addClass("menuText");
		
		button.click(clickCallback);
		
		button.append(buttonIndicator);
		button.append(buttonText);
		
		return button;
	},
	postList: Array(),
	// called when created, and later when changing options
	_refresh: function() {
		
		// trigger a callback/event
		this._trigger( "change" );
	},

	// events bound via _bind are removed automatically
	// revert other modifications here
	_destroy: function() {
		// remove generated elements
		this.changer.remove();

	},

	// _setOptions is called with a hash of all options that are changing
	// always refresh when changing options
	_setOptions: function() {
		// in 1.9 would use _superApply
		$.Widget.prototype._setOptions.apply( this, arguments );
		this._refresh();
	},

	// _setOption is called for each individual option that is changing
	_setOption: function( key, value ) {

		// in 1.9 would use _super
		$.Widget.prototype._setOption.call( this, key, value );
	}
});