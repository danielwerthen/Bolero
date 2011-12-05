var express = require('express');
var app = express.createServer();
var connect = require('connect');
var sio = require('socket.io');
var app = express.createServer();
var io = sio.listen(app);
var dbio = require('./dbio-v2');
var auth = require('./server/auth');
var thoughtio = require('./server/thoughtio');

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
        
      auth(db, socket);
      thoughtio(db, socket);
      
    });
});
