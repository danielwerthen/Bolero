function initSocket(thisWidget) {
  console.log('connecting to ' + document.domain);
  var socket = io.connect('http://' + document.domain + '/thoughts');
  socket.on('connect', function () {
    console.log('connected');
    socket.on('thought', function (recievedthought) {
        thisWidget.addThought(recievedthought);
    });   
    
    socket.on('user', function (recievedthought) {
       var i = 0;
    }); 

    //subscribe to mediator updates
    amplify.subscribe(messages.thought.update, function(arg){
  		socket.emit('getthoughts', {});      
  	});
  	
  	amplify.subscribe(messages.thought.create, function(thought){
      socket.emit('insertthought', thought);
  	});
  

    amplify.subscribe(messages.thought.get, function(thoughtId){
      var thought = thisWidget.objectModel.thoughts[thoughtId];
      if(thought === undefined)
      {
        socket.emit('getthoughts', { _id: thoughtId});
      }  
      amplify.publish(messages.thought.update+"?"+thoughtId, thought);
  	});
  });
  socket.on('error', function (error) {
    console.log('connection failed due to ' + error);
    if (error == 'handshake error') {
      amplify.publish(interface.messages.openLoginView, {});
    }
    else {
      setTimeout(function () {
        socket.socket.connect();
      }, 500);
    }
  });
  socket.socket.on('error', function (error) {
    console.log('socket failed due to ' + error);
  });
  socket.socket.on('connect', function () {
    console.log('socket is connected');
  });
}
  
  
  $.widget( "TestNamespace.objectHandlerModule", {
			// the constructor
			_create: function() {
				
				
				var indexInThoughtList = 0;
				
				var thisWidget = this;
        amplify.subscribe(interface.messages.login, function(loginobject){
            $.ajax({
              type: 'POST',
              url: 'http://' + document.domain + '/login',
              data: loginobject,
              datatype: 'json',
              success: function (result) {
                if (result.authorized)
                  location.reload();
                else
                  amplify.publish(interface.messages.openLoginView, {});
              }
            });
        });
        initSocket(thisWidget);
        
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
