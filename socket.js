var express = require('express');
var app = express.createServer();
var connect = require('connect');
var sio = require('socket.io');
var app = express.createServer();
var io = sio.listen(app);
var dbio = require('./dbio-v2');

app.set('view engine', 'jade');
app.use(connect.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
	});
  res.end('Please use SocketIO to talk to me.');
});

if (process.env.PORT)
  app.listen(process.env.PORT);
else
  app.listen(8888);

io.set('log level', 1);                    // reduce logging

dbio(function(err, db) {
  if (err || db === null) {
    console.log('failed to open BoleroDb : ' + db);
    return;
  }
  var thinkers = io
    .of('/thoughts')
    .on('connection', function(socket) {
        socket.emit('handshake', {
          authorized: (socket.auth === true) ? true : false
        });
        socket.on('handshake', function(data) {
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
        
        socket.on('getthoughts', function(filter) {
          socket.get('user', function(err, user) {
            if (!err) {
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
            }
            else {
              socket.emit('getthoughts', {
                authorized: false
              });
            }
          });
        });
      });
});
