var io = require('socket.io'),
		express = require('express'),
		connect = require('connect'),
		MemoryStore = connect.session.MemoryStore;
		app = express.createServer(),
		sessionStore = new MemoryStore(),
		Session = require('connect').middleware.session.Session,
		parseCookie = require('connect').utils.parseCookie,
		auth = require('./server-v2/auth.js');


app.configure(function () {
	app.use(connect.static(__dirname + '/public'));
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ store: sessionStore,
		secret: 'this is secret', 
		key: 'express.sid'}));
	app.use(app.router);
	app.set('view engine', 'jade');
	app.all(function (req, res, next) {
		console.log('all');
		next();
	});
});

app.get('/', function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
	});
  res.end('<h2>Hello, use socketio to connect to me!</h2>');
});

app.get('/login', auth.get);
app.post('/login', auth.post);
app.get('/register', auth.getRegister);
app.post('/register', auth.postRegister);

if (process.env.PORT)
  app.listen(process.env.PORT);
else
  app.listen(8888);
var sio = io.listen(app);

sio.set('authorization', function (data, accept) {
	if (data.headers.cookie) {
		data.cookie = parseCookie(data.headers.cookie);
		data.sessionID = data.cookie['express.sid'];
		
		data.sessionStore = sessionStore;
		sessionStore.get(data.sessionID, function (err, session) {
			if (err || !session) {
				accept('unauthorized', false);
			}
			else {
				data.session = new Session(data, session);
        if (session.currentUser && session.auth)
				  accept(null, true);
        else
          accept('unauthorized', false);
			}
		});
	}
	else {
		return accept('No cookie transmitted', false);
	}
});

sio.of('/bolero').on('connection', function (socket) {
	var hs = socket.handshake;
	console.log('A socket opened by user: ' + hs.session.currentUser.username
							+ ' connected');

	var intervalID = setInterval(function () {
		hs.session.reload( function () {
			hs.session.touch().save();
		});
	}, 60 * 1000);
  
  //tio.setup(socket);

	socket.on('disconnect', function () {
		console.log('A socket with sessionID ' + hs.sessionID + ' disconnected!');
		clearInterval(intervalID);
	});
});
