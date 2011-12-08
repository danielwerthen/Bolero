var io = require('socket.io'),
		express = require('express'),
		connect = require('connect'),
		MemoryStore = connect.session.MemoryStore;
		app = express.createServer(),
		sessionStore = new MemoryStore(),
		Session = require('connect').middleware.session.Session,
		parseCookie = require('connect').utils.parseCookie;


app.configure(function () {
	app.use(connect.static(__dirname + '/public'));
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ store: sessionStore,
		secret: 'this is secret', 
		key: 'express.sid'}));
	app.use(app.router);
	app.all(function (req, res, next) {
		console.log('all');
		next();
	});
});

app.get('/', function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
	});
  res.end('<h2>Hello, your session id is ' + req.sessionID + '</h2>');
});

app.post('/login', function (req, res) {
	
});

app.get('')

app.listen(8888);
var sio = io.listen(app);

sio.set('authorization', function (data, accept) {
	if (data.headers.cookie) {
		data.cookie = parseCookie(data.headers.cookie);
		data.sessionID = data.cookie['express.sid'];
		
		data.sessionStore = sessionStore;
		sessionStore.get(data.sessionID, function (err, session) {
			if (err || !session) {
				accept('Error', false);
			}
			else {
				data.session = new Session(data, session);
				accept(null, true);
			}
		});
	}
	else {
		return accept('No cookie transmitted', false);
	}
});

sio.sockets.on('connection', function (socket) {
	var hs = socket.handshake;
	console.log('A socket with sessionID ' + socket.handshake.sessionID
							+ ' connected');

	var intervalID = setInterval(function () {
		hs.session.reload( function () {
			hs.session.touch().save();
		});
	}, 60 * 1000);

	socket.on('disconnect', function () {
		console.log('A socket with sessionID ' + hs.sessionID + ' disconnected!');
		clearInterval(intervalID);
	});
});