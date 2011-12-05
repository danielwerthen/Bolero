	$.widget( "TestNamespace.objectHandlerModule", {
			// the constructor
			_create: function() {
				
				
				var indexInThoughtList = 0;
				
				var thisWidget = this;
				//subscribe to mediator updates
				amplify.subscribe(thought.messages.update, function(arg){
						
										thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
				thisWidget.addItem(thought.messages.add,{title:"sadafdfbdfgbdfgbdfg",content:"dsdfsdfsdfdsfsddfsd"});
						
							
						
						
						
				//		thisWidget.addItem(thought.messages.add,{thought:objectModel.thoughts[indexInThoughtList]});	
						//
				//	indexInThoughtList++;	
		/*
				$.ajax({
		        type: 'POST',
		        url: 'http://bolero.ulfdavidsson.mindlier.c9.io/login',
		        data: { username: 'udn', password: '123123123' },
		        datatype: 'application/json',
		        success: function(data) {
		          if (data.authorized === true) {
		           
		            $.ajax({
		              type: 'GET',
		              url: 'http://bolero.ulfdavidsson.mindlier.c9.io/api/getthoughts',
		              dataType: "jsonp",
		              success: function(data) {
		                alert(JSON.stringify(data));
		              }
		            });
		          }
		        }
		      });		
		*/
				});
				
				amplify.subscribe(thought.messages.create, function(arg){
					
				//	alert("not done");
					//1. ajax call to add to server. this shuld return te real object when done
					//2. add real object to thoughts list
					//3. sen added call via mediator
			
					thisWidget.addItem(thought.messages.add,arg);
					});
		
				this._refresh();
			},
	
			addItem: function(message, arg) { 
					 
					 amplify.publish(message, arg );
					 
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
