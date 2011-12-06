	$.widget( "TestNamespace.listThoughtModule", {
			// default options
			options: {
			},
			
			// the constructor
			_create: function() {
				
				var thisWidget = this;
				var list = create('div').addClass("thoughtList");
				
				
				//subscribe to mediator updates
				amplify.subscribe(messages.thought.add, function(thoughtId){
								
								thisWidget.ItemAdded(list,thoughtId);		
				});
				
				this.element.append(list);
	
				this._refresh();
			},
	
			ItemAdded: function(list, thoughtId) { 

				var thoughtVisual = create("div").thoughtModule({"thoughtId":thoughtId});
				list.append(thoughtVisual);
					 					 
			},	
			
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
