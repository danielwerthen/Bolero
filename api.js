var express = require('express');
var app = express.createServer();
var connect = require('connect');
var MemoryStore = require('connect').session.MemoryStore;
var dbio = require('./dbio');
var auth = require('./authentication');
var url = require('url');

app.set('view engine', 'jade');
app.use(connect.static(__dirname + '/public'));
app.use(function (req, res, next) {
  next();
});
app.use(connect.bodyParser());
app.use(function (req, res, next) {
  next();
});
app.use(express.cookieParser());
app.use(function (req, res, next) {
  next();
});
app.use(express.session({secret: 'your_secret_is_safe_here', store:new MemoryStore( {reapInterval: 60000 * 10} )})); 
app.use(function (req, res, next) {
  next();
});
app.use(auth({ redirect: false }));
app.use(app.router);

var buildThought = function(title, content, user) {
  return {
    createDate: new Date(),
    userId: user._id,
    title: title,
    content: content
  };
};

app.post('/login', function(req, res) {
  res.writeHead(200, {
  	'Content-Type': 'application/json',
		'Access-Control-Allow-Origin' : 'localhost:8888'
	});
  res.end(JSON.stringify({ authorized: true }));
});

app.get('/login', function(req, res) {
  res.end();
});

app.get('/api/getthoughts:callback?', function (req, res, next) {
  
  dbio.getDocs('thoughts', function (err, thoughts) {
    if (err !== null) {
      res.end();
      return;
    }
    if (thoughts === undefined) {
      res.end();
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'jsonp'
  	});
    res.end(req.params.callback + '(' + JSON.stringify({ thoughts: thoughts }) + ')');
  }, { userId: req.session.currentUser._id });
});

app.get('/api/getthoughts', function(req, res, next) {
  dbio.getDocs('thoughts', function (err, thoughts) {
    if (err !== null) {
      res.end();
      return;
    }
    if (thoughts === undefined) {
      res.end();
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : 'localhost2:8888'
    });
    res.end(JSON.stringify({ thoughts: thoughts }));
  }, { userId: req.session.currentUser._id });
});

app.post('/api/addthought', function(req, res) {
  if (req.body && req.body.title && req.body.content) {
    dbio.insertDoc('thoughts', buildThought(req.body.title, req.body.content, req.session.currentUser), function (err) {
      res.end();
    });  
  }
  else {
    res.end();
  }
});

if (process.env.PORT)
  app.listen(process.env.PORT);
else
  app.listen(8888);
