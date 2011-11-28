var express = require('express');
var app = express.createServer();
var connect = require('connect');
var MemoryStore = require('connect').session.MemoryStore;
var url = require('url');
var dbio = require('./dbio');
var auth = require('./authentication');

app.set('view engine', 'jade');
app.use(connect.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'your_secret_is_safe_here', store:new MemoryStore( {reapInterval: 60000 * 10} )})); 
app.use(auth());
app.use(app.router);

var buildThought = function(title, content) {
  return {
    userId: 5,
    title: title,
    content: content,
    createDate: Date.now
  };
};


app.get('/', function (req, res, next) {
  dbio.getDocs('thoughts', function (err, thoughts) {
    if (err !== null) {
      console.log(JSON.stringify(err));
      res.end();
      return;
    }
    if (thoughts === undefined) {
      console.log('no result');
      res.end();
      return;
    }
    console.log(thoughts.length);
    for(var i in thoughts) {
      res.write(JSON.stringify(thoughts[i]) + '\n');
    }
    res.end();
  });
});

app.get('/registrate', function (req, res, next) {
  res.render('registration', { auth: req.session.auth });
});

app.post('/registrate', function (req, res, next) {
  res.render('registration', { auth: req.session.auth });
});

app.get('/thought', function (req, res, next){
  var parts = url.parse(req.url, true);
  
  dbio.insertDoc('thoughts', buildThought(parts.query.title, parts.query.content), function (err) {
    if (err !== null) { 
      console.log(JSON.stringify(err)); 
    }
    else { 
      console.log('inserted'); 
    }
  
    res.end();
  });
}); 

app.listen(process.env.PORT);
