$.widget( "TestNamespace.userModule", {
    // default options
    options: {
		o: null,
        userId: -1
		},

	// the constructor
	_create: function() {
	//amplify getthought?id
    
        var thisWidget = this;
        var userVisual = this.element.addClass("user");
        var loadingIcon = create("p").text("loading").addClass("loadingIcon");
        
        userVisual.append(loadingIcon);
        
        amplify.subscribe(messages.user.update+"?"+thisWidget.options.userId, function(user){   				
           userVisual.html("");
           thisWidget.user = user;        
            userVisual.append(create("p").text("username: "+ thisWidget.user.username));            
		});
       
        amplify.publish(messages.user.get, thisWidget.options.userId);   
       
	
		this._refresh();
	},
    user: {},
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