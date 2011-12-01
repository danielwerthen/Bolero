var express = require('express');
var app = express.createServer();
var connect = require('connect');
var sio = require('socket.io');
var app = express.createServer();
var io = sio.listen(app);
var dbio = require('./dbio');

app.use(connect.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.end();
});

if (process.env.PORT)
  app.listen(process.env.PORT);
else
  app.listen(8888);

io.set('log level', 1);                    // reduce logging


var thinkers = io
.of('/thoughts')
.on('connection', function(socket) {
    socket.emit('handshake', {
      authorized: (socket.auth === true) ? true : false
    });
    socket.on('handshake', function(data) {
      if (data.username && data.password) {
        dbio.authenticate(data.username, data.password, function(result) {
          socket.set('auth', result, function() {
            socket.emit('handshake', {
              authorized: result
            });
          });
        });
      }
      else {
        socket.get('auth', function(err, auth) {
          socket.emit('handshake', {
            authorized: err ? false : auth
          });
        });
      }
    });
    
    socket.on('getthoughts', function(data) {
      socket.get('auth', function(err, auth) {
        if (auth === true) {
          
        }
        else {
          socket.emit('getthoughts', {
            authorized: false
          });
        }
      });
    });
  });


