function ioHandler(socket, e, callback) {
	socket.on(e, function(data) {
		socket.get('user', function(err, user) {
			if (!err && user) {
				callback(data, user)
			}
			else {
				socket.emit(e, {
					authorized: false
				});
			}
		});
	});
}

exports = module.exports = function(db, socket) {

	var getThoughts = function(filter, user) {
		var query = {};
    var abort = false;
    if (filter) {
      if (filter.userId !== undefined) {
        if (typeof filter.userId == 'string')
          query.userId = filter.userId;
        else if (filter.userId.toString !== undefined)
          query.userId = filter.userId.toString();
        else
          abort = true;
      }
      else
        query.userId = user._id.toString();
       if (filter.thoughtId !== undefined) {
       	if (typeof filter.thoughtId == 'string')
       		query._id = filter.thoughtId;
       	else if (filter.thoughtId.toString !== undefined)
       		query._id = filter.thoughtId.toString();
       	else
       		abort = true;
       }
    }
    if (!abort) {
      db.foreach('thoughts', query, function (err, thought) {
        if (!err && thought !== null)
          socket.emit('thought', thought);
        else if (err) {
        	socket.emit('getthoughts', { err: 'Failed' });	
        }
        else {
        	socket.emit('getthoughts', { result: null });
        }
      });
    }
	};

	var insertThought = function(thought, user) {
		if (thought.title && thought.content) {
			thought.userId = user._id;
      thought.createDate = new Date();
			db.insert('thoughts', thought, function(err, result) {
				if (!err)
					socket.emit('insertthought', {
						result: result
					});
				else
					socket.emit('insertthought', {
						err: 'Exception'
					});
			});
		}
		else {
			socket.emit('insertthought', {
				err: 'Undefined'
			});
		}
	};
  
  var insertLink = function(link, user) {
    if (link.fromId && link.toId) {
      
    }
  };

	ioHandler(socket, 'getthoughts', getThoughts);
  ioHandler(socket, 'insertThought', insertThought);
};