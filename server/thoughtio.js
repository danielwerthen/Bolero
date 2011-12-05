function ioHandler(socket, e, callback) {
	socket.on(e, function(data) {
		socket.get('user', function(err, user) {
			if (!err) {
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
    }
    if (!abort) {
      db.foreach('thoughts', { userId: user._id.toString() }, function (err, thought) {
        if (!err && thought !== null)
          socket.emit('thought', thought);
      });
    }
	};

	var insertThought = function(thought, user) {
		if (thought.title && thought.content) {
			thought.userId = user._id;
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

	ioHandler(socket, 'getthoughts', getThoughts);
};