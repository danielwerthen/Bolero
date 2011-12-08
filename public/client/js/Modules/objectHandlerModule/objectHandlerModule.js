	$.widget( "TestNamespace.objectHandlerModule", {
			// the constructor
			_create: function() {
				
				
				var indexInThoughtList = 0;
				
				var thisWidget = this;

                var socket = io.connect('http://' + document.domain + '/thoughts');
                socket.on('handshake', function (data) {
                    if (data.authorized === false) 
                    {
                        amplify.publish(interface.messages.openLoginView, {});
                        amplify.subscribe(interface.messages.login, function(loginobject){		
                             socket.emit('handshake', loginobject);
                             //socket.emit('getusers', {"username": loginobject.username});
                             
        				});
                    }
                });        
                      
                socket.on('thought', function (recievedthought) {
                    thisWidget.addThought(recievedthought);
                });   
                
                socket.on('user', function (recievedthought) {
                   var i = 0;
                });    

                //subscribe to mediator updates
				amplify.subscribe(messages.thought.update, function(arg){
					//TODO: replace with real use of server connection	
                    socket.emit('getthoughts', {});      
				});
				
				amplify.subscribe(messages.thought.create, function(thought){
					
				//	alert("not done");
					//1. ajax call to add to server. this shuld return te real object when done
					//2. add real object to thoughts list
					//3. sen added call via mediator
			        socket.emit('insertthought', thought);
					//thisWidget.addThought(arg);
					});
		
            	amplify.subscribe(messages.thought.get, function(thoughtId){
					
                    var thought = thisWidget.objectModel.thoughts[thoughtId];
                    
                    if(thought === undefined)
                    {
                        socket.emit('getthoughts', { _id: thoughtId}); 
                       
                    }
                    
			        amplify.publish(messages.thought.update+"?"+thoughtId, thought);
            
				});
        
				this._refresh();
			},
            
            objectModel : {
                users : [],
	            thoughts: [],
	            linkings : [],
	            linkingTypes : []	
            },
			addThought: function(thought) { 
					 
                     this.objectModel.thoughts[thought._id] = thought;
                     
					 amplify.publish(messages.thought.add, thought._id );
					 
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
