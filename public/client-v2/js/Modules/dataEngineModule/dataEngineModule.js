$.widget( "TestNamespace.dataEngineModule", {
			// default options
			options: {
			},
			
			// the constructor
			_create: function() {
			
			var thisWidget = this;					
			
            
             amplify.subscribe(messages.interface.loadConversations, function(arg) {
                 amplify.publish(messages.conversation.request);
            });
            
			amplify.subscribe(messages.message.recieve, function(message) {
          		if(message._id !== undefined && message._id)
          		{
          			if(thisWidget.messages[message._id] !== undefined )
          			{
          				thisWidget.messages[message._id]= message;
          				amplify.publish(messages.message.add,message);
          			}
          			else
          			{
          				thisWidget.messages[message._id]= message;
          				amplify.publish(messages.message.update,message);
          			}
          			
          		}
          		
          		
    		});

								
									
				this._refresh();
			},
			conversations:[],
			messages:[],
			users:[],		
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
