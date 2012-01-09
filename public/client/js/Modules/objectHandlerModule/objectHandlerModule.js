function initSocket(thisWidget) {
  console.log('connecting to ' + document.domain );
  var sio = io.connect('http://' + document.location.host + '/bolero');
  sio.on('connect', function() {
    console.log('connected');
    
    sio.on('thought', function(recievedthought) {
      thisWidget.addThought(recievedthought);
    });

    sio.on('user', function(recievedUser) {
      this.Widget.addUser(recievedUser);
    });

    //subscribe to mediator updates
    amplify.subscribe(messages.thought.update, function(arg) {
      //TODO: replce with 
      //getlatestthought
      //when current user id is saved
      /*
      sio.emit('getthoughts', {}, function(thoughts) {
        for(var i in thoughts) {
          var thought = thoughts[i];
          thisWidget.addThought(thought);
        }
      });*/
      
      /*sio.emit('getlatestthought', {userId:"4ed54e1a3733af7234000001"}, function(thoughts) {
          thisWidget.addThought(thoughts);
      });*/
			console.log('load convos');
			sio.emit('getConversations', {}, function (convos) {
				if (!convos || convos.length === 0) {
					//add conversation
					console.log('no convo');
				}
				else {
					var convo1 = convos[1];
					sio.emit('getMessages', { conversationId: convo1._id }, function (messages) {
						for (var i in messages)
							thisWidget.addThought(messages[i]);
					});
				}
			});
    });

    amplify.subscribe(messages.thought.create, function(thought, parentThought) {
    
            sio.emit('insertthought', thought,function(insertedThoughtArray){
            
                var insertedThought = insertedThoughtArray[0];
                var insertedId = insertedThought._id;
                if(insertedId !== undefined)
                {
                    if(parentThought != null)
                    {
                        var link = {"fromId":parentThought._id,"toId":insertedId };
                        sio.emit('insertlink', link, function(recievedLink){
                            
                                amplify.publish(messages.thought.getLinks, parentThought._id);
                            
                            }); 
                        
                    }
                    
                    thisWidget.addThought(insertedThought);
                } 
            });  
    });

    amplify.subscribe(messages.thought.get, function(thoughtId) {
      var thought = thisWidget.thoughts[thoughtId];
      if (thought === undefined) {
        sio.emit('getthought', {
          _id: thoughtId
        }, 
        function(result){
            if(result !== undefined )
            {
                thought = result;
            }
        });
      }
      amplify.publish(messages.thought.update + "?" + thoughtId, thought);
    });
    
    amplify.subscribe(messages.user.get, function(userId) {
      var user = thisWidget.users[userId];
      if (user === undefined) {
        sio.emit('getuser', {
          _id: userId
        },
        function(result){
            if(result !== undefined)
            {
                user = result;
               // this.users[user._id] = user;
               amplify.publish(messages.user.update + "?" + userId, user);
            }
        });
      }
      else
      {
          amplify.publish(messages.user.update + "?" + userId, user);
        }
      
    });
    
   amplify.subscribe(messages.thought.getLinks, function(thoughtId) {
     
        sio.emit('getlinks', {
          fromId: thoughtId
        },
        function(result){
            if(result !== undefined)
            {
              amplify.publish(messages.thought.getLinks + "?" + thoughtId, result);
            }
        });
        
    });
    
  });

  
  sio.on('error', function(error) {
    console.log('connection failed due to ' + error);
    if (error == 'handshake error') {
      amplify.publish(interface.messages.openLoginView);
    }
    else {
      setTimeout(function() {
        sio.socket.connect();
      }, 500);
    }
  });
  return sio;
}

$.widget("TestNamespace.objectHandlerModule", {
  // the constructor
  _create: function() {


    var indexInThoughtList = 0;

    var thisWidget = this;
    amplify.subscribe(interface.messages.login, function(loginobject) {
      $.ajax({
        type: 'POST',
        url: 'http://' + document.location.host + '/login',
        data: loginobject,
        datatype: 'json',
        success: function(result) {
          if (result.authorized) setTimeout(function() {
            sio.socket.connect();
          }, 500);
          else amplify.publish(interface.messages.openLoginView);
        }
      });
    });
    
    var sio = initSocket(thisWidget);

    this._refresh();
  },

    users: [],
    thoughts: [],
    linkings: [],
    linkingTypes: [],
  addThought: function(thought) {

    this.thoughts[thought._id] = thought;

    amplify.publish(messages.thought.add, thought._id);

  },
  addUser: function(user) {
          this.users[user._id] = user;

    amplify.publish(messages.user.add, user._id);
  },

  // called when created, and later when changing options
  _refresh: function() {

    // trigger a callback/event
    this._trigger("change");
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
    $.Widget.prototype._setOptions.apply(this, arguments);
    this._refresh();
  },

  // _setOption is called for each individual option that is changing
  _setOption: function(key, value) {

    // in 1.9 would use _super
    $.Widget.prototype._setOption.call(this, key, value);
  }
});
