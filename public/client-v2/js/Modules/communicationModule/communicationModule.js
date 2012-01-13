$.widget( "TestNamespace.communicationModule", {
			// default options
			options: {
			},
			
			// the constructor
			_create: function() {
			
			var thisWidget = this;					
							
			var sio = thisWidget.initSocket(thisWidget);				
									
			this._refresh();
			},	
			initSocket: function(thisWidget) {
				var sio = io.connect('http://' + document.location.host + '/bolero');
				sio.on('connect', function() {
				     return sio;
				});
				
				//subscribe to mediator updates
			    amplify.subscribe(messages.conversation.request, function(arg) {
						sio.emit('getConversations', {}, function (convos) {
							if (!convos || convos.length === 0) {
								//add conversation
								console.log('no convo');
							}
							else {
								var convo1 = convos[1];
								
								amplify.publish(messages.conversation.recieve,convo1);
								
								/*sio.emit('getMessages', { conversationId: convo1._id }, function (messagelist) {
									for (var i in messagelist)
										amplify.publish(messages.message.recieve,messagelist[i]);
								});*/
							}
						});
			    });
    
			    amplify.subscribe(messages.message.request, function(arg) {
						sio.emit('getMessage', arg, function (recievedMessage) {
							if (!recievedMessage || recievedMessage === 0) {
								//add conversation
								console.log('no recievedMessage');
							}
							else {
										amplify.publish(messages.message.recieve,recievedMessage);
							}
						});
			    });
			    
			    amplify.subscribe(messages.interface.login, function(logindata) {
			      $.ajax({
				        type: 'POST',
				        url: 'http://' + document.location.host + '/login',
				        data: logindata,
				        datatype: 'json',
				        success: function(result) {
				          if (result.authorized) setTimeout(function() {
				            sio.socket.connect();
				          }, 500);
				          else amplify.publish(messages.interface.openLoginView);
				        }
					});
				});
				
				sio.on('error', function(error) {
				   	if (error == 'handshake error') {
				      amplify.publish(messages.interface.openLoginView);
				    }
				    else {
				      setTimeout(function() {
				        sio.socket.connect();
				      }, 500);
				    }
				});
				
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




