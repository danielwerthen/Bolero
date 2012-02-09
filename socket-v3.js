var io = require('socket.io'),
		express = require('express'),
		connect = require('connect'),
		MemoryStore = connect.session.MemoryStore;
		app = express.createServer(),
		sessionStore = new MemoryStore(),
		Session = require('connect').middleware.session.Session,
		parseCookie = require('connect').utils.parseCookie,
		auth = require('./server-v2/auth.js'),
		cio = require('./server-v2/conversationsio.js'),
		conv = require('./server-v2/conversations.js'),
		users = require('./server-v2/users.js');


app.configure(function () {
	app.use(connect.static(__dirname + '/public'));
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ store: sessionStore,
		secret: 'this is secret', 
		key: 'express.sid'}));
	app.use(function (req, res, next) {
		if ((!req.session || !req.session.auth) && req.url !== '/index' && req.url !== '/login') {
			return res.redirect('/index');
		}
		if (!res.render.overridden) {
			var _render = res.render;
			res.render = function (view, options) {
				options = options || {};
				options.auth = req.session.auth;
				options.currentUser = req.session.currentUser;
				_render.apply(res, [view, options]);
			};
			res.render.overridden = true;
		}
		return next();
	});
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/views-v2');
});

app.get('/index', function (req, res) {
	res.render('index.jade');
});

app.get('/read', function (req, res) {
	users.getConversations(req.session.currentUser._id, function (err, convs) {
		if (err) {
			console.log(err);
			res.redirect('/index');
		}
		else
			res.render('read.jade', { conversations: convs });
	});
});

app.get('/review', function (req, res) {
	res.render('index.jade');
});

app.get('/write/:id', function (req, res) {
	console.log(req.params.id);
	conv.getMessages(req.params.id, function (err, messages) {
		if (err) {
			console.log(err);
			res.render('/index');
		}
		else {
			res.render('write.jade', { messages: messages });
		}
	});
});

app.get('/login', auth.get);
app.post('/login', auth.post);
app.get('/logout', auth.logout('/index'));
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
	console.log('A socket opened by user: ' + hs.session.currentUser.email
							+ ' connected');

	var intervalID = setInterval(function () {
		hs.session.reload( function () {
			hs.session.touch().save();
		});
	}, 60 * 1000);
  
  cio.setup(socket);

	socket.on('disconnect', function () {
		console.log('A socket with sessionID ' + hs.sessionID + ' disconnected!');
		clearInterval(intervalID);
	});
});
