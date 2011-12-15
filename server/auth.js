exports = module.exports = function (db, socket) {
	socket.emit('handshake', {
		authorized: false
	});
	socket.on('handshake', function(data) {
    console.dir(data);
    if (data.username && data.password) {
      db.toArray('users', {username: data.username, password: data.password}, function(err, user) {
        if (err || user.length == 0) {
          socket.emit('handshake', {
            authorized: false
          });
        }
        else {
          socket.set('user', user[0], function() {
            socket.emit('handshake', {
              authorized: true
            });
          });
        }
      });
    }
    else {
      socket.get('user', function(err, user) {
        socket.emit('handshake', {
          authorized: user === null ? false : true
        });
      });
    }
  });
};