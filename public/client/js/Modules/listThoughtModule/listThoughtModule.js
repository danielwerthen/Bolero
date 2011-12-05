	$.widget( "TestNamespace.listThoughtModule", {
			// default options
			options: {
			},
			
			// the constructor
			_create: function() {
				
				var thisWidget = this;
				var list = create('ul').addClass("thoughtList");
				
				
				//subscribe to mediator updates
				amplify.subscribe(thought.messages.add, function(arg){
								
								thisWidget.ItemAdded(list,arg);		
				});
				
				this.element.append(list);
	
				this._refresh();
			},
	
			ItemAdded: function(list, thought) { 

					var thoughtVisual = create("div").addClass("thougth");
					thoughtVisual.data("Tag",thought);
					thoughtVisual.append(create("h3").text(thought.title));
					thoughtVisual.append(create("p").text(thought.content));
					//thoughtVisual.append(create("p").text(thought.user.firstname+ " " + thought.user.lastname).addClass("user"));
	/*				for(var _linking = 0; _linking < thought.linkings.length; _linking++)
					{
							thoughtVisual.append(create("p").text(thought.linkings[_linking].id).addClass("linking"));
					}
	*/
		
				list.append(create('li').append(thoughtVisual));
					 					 
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
