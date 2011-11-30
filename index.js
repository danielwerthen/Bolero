var express = require('express');
var app = express.createServer();
var connect = require('connect');
var MemoryStore = require('connect').session.MemoryStore;
var url = require('url');
var dbio = require('./dbio');
var auth = require('./authentication');
var db = require('mongodb');

app.set('view engine', 'jade');
app.use(connect.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'your_secret_is_safe_here', store:new MemoryStore( {reapInterval: 60000 * 10} )})); 
app.use(auth());
app.use(app.router);

var buildThought = function(title, content, user) {
  return {
    createDate: new Date(),
    userId: user._id,
    title: title,
    content: content
  };
};


app.get('/', function (req, res, next) {
  dbio.getDocs('thoughts', function (err, thoughts) {
    if (err !== null) {
      res.end();
      return;
    }
    if (thoughts === undefined) {
      res.end();
      return;
    }
    res.render('index', { thoughts: thoughts });
  }, { userId: req.session.currentUser._id });
});

app.get('/api/getthoughts', function (req, res, next) {
  dbio.getDocs('thoughts', function (err, thoughts) {
    if (err !== null) {
      res.end();
      return;
    }
    if (thoughts === undefined) {
      res.end();
      return;
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
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

app.get('/registrate', function (req, res, next) {
  res.render('registration', { auth: req.session.auth });
});

app.post('/registrate', function (req, res, next) {
  res.render('registration', { auth: req.session.auth });
});

app.get('/login', function(req, res, next) {
    res.render('login');
});

app.post('/login', function(req, res, next) {
  res.redirect('home');
});

app.get('/thought', function (req, res, next){
  var parts = url.parse(req.url, true);
  //nothing to see here
  dbio.insertDoc('thoughts', buildThought(parts.query.title, parts.query.content, req.session.currentUser), function (err) {
    res.redirect('home');
  });
}); 

app.post('/thought', function(req, res, next){
  dbio.insertDoc('thoughts', buildThought(req.body.title, req.body.content, req.session.currentUser), function (err) {
    res.redirect('back');
  });
});


if (process.env.PORT)
  app.listen(process.env.PORT);
else
  app.listen(8888);
