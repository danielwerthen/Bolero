var dbio = require('../dbio-v2');
function ioHandler(socket, e, callback) {
  
  if (socket.handshake && socket.handshake.session) {
    socket.on(e, function (data) {
      console.log(e + ': ' + JSON.stringify(data));
      callback(data, socket.handshake.session.currentUser);
    });
  }
  else {
    socket.on(e, function(data) {
      console.log(e + '= ' + JSON.stringify(data));
      socket.get('user', function(err, user) {
        if (!err && user) {
          callback(data, user);
        }
        else {
          socket.emit(e, {
            authorized: false
          });
        }
      });
    });
  }
}

function initialize(db, socket) {
  socket.on('insertuser', function (user) {
    if (user.username && user.password && user.email) {
      user.createDate = new Date();
      db.insert('users', user, function(err, result) {
        if (!err) {
          delete result.password;
          socket.emit('insertuser', result);
        }
      });
    }
  });
  
  var getUsers = function (filter, current) {
    db.foreach('users', filter, function (err, user) {
      if (!err && u !== null)
        socket.emit('user', user);
    });
  };
  
  var getThoughts = function (filter, user) {
		db.foreach('thoughts', filter, function (err, thought) {
      if (!err && thought !== null)
        socket.emit('thought', thought);
    });
	};

	var insertThought = function(thought, user) {
		if (thought.title && thought.content) {
			thought.userId = user._id.toString();
      thought.createDate = new Date();
			db.insert('thoughts', thought, function(err, result) {
				if (!err) {
					socket.emit('insertthought', result[0]);
				}
				else {
					console.log('added thought');
				}
			});
		}
	};
  
  var insertLink = function (link, user) {
    if (link.fromId && link.toId) {
      link.userId = user._id.toString();
      link.createDate = new Date();
      db.insert('links', link, function(err, result) {
        if (!err) {
          socket.emit('insertlink', result);
        }
        else {
          console.log('added link');
        }
      });
    }
  };
  
  var getLinks = function (filter, user) {
    console.log('getlinks ' + JSON.stringify(filter));
    db.foreach('links', filter, function (err, thought) {
      if (!err && thought !== null)
        socket.emit('link', thought);
    });
  };
  
  var getLinkedThoughts = function (from, to) {
    return function (filter, currentUser) {
      if (filter.thoughtId) {
        var query = { from: filter.thoughtId };
        db.foreach('links', query, function (err, link) {
          if (!err && link) {
            db.foreach('thoughts', { _id: link[to] }, function (err, thought) {
              if (!err && thought) {
                thought.link = link;
                socket.emit('thought', thought);
              }
            });
          }
        });
      }
    };
  };
  
  var getForwardThoughts = getLinkedThoughts('fromId', 'toId');
  var getBackwardThoughts = getLinkedThoughts('toId', 'fromId');

  ioHandler(socket, 'getusers', getUsers);
	ioHandler(socket, 'getthoughts', getThoughts);
  ioHandler(socket, 'insertthought', insertThought);
  ioHandler(socket, 'getlinks', getLinks);
  ioHandler(socket, 'insertlink', insertLink);
  ioHandler(socket, 'getforwardthoughts', getForwardThoughts);
  ioHandler(socket, 'getbackwardthoughts', getBackwardThoughts);
}

exports = module.exports = function(db, socket) {
  if (!db) {
    dbio(function(err, db) {
      if (err || db === null) {
        console.log('failed to open BoleroDb : ' + db);
        return;
      }
      initialize(db, socket);
    });
  }
  else {
    initialize(db, socket);
  }
};