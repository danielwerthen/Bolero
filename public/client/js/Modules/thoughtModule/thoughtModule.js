$.widget( "TestNamespace.thoughtModule", {
    // default options
	options: {
		o: null,
        thoughtId: -1
		},

	// the constructor
	_create: function() {
	//amplify getthought?id
    
    var thisWidget = this;
    
	    var thoughtVisual = this.element.addClass("thougth");
		
            amplify.subscribe(messages.thought.update+"?"+thisWidget.options.thoughtId, function(thought){
					
                    thisWidget.thought = thought;
                                       
                    thoughtVisual.append(create("h3").text(thisWidget.thought.title));
    				thoughtVisual.append(create("p").text(thisWidget.thought.content));
					//thoughtVisual.append(create("p").text(thought.user.firstname+ " " + thought.user.lastname).addClass("user"));

    			var userVisual = create("div").userModule({"userId":thought.userId});
				thoughtVisual.append(userVisual);


/*				for(var _linking = 0; _linking < thought.linkings.length; _linking++)
					{
							thoughtVisual.append(create("p").text(thought.linkings[_linking].id).addClass("linking"));
					}
	*/
        	var respondbutton = create("button").text("respond");

    		respondbutton.click(function(){
                amplify.publish(interface.messages.openCreateView, thisWidget.thought);
                });

            thoughtVisual.append(respondbutton);
          
				});
        
        
             amplify.publish(messages.thought.get, thisWidget.options.thoughtId);   

		
			
		this._refresh();
	},
    thought: {},
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