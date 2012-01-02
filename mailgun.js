var Mailgun = require('mailgun').Mailgun,
    express = require('express'),
    app = express.createServer();
    
app.configure(function () {
	app.use(express.bodyParser());
	app.use(app.router);
});

app.post('/messages', function (req, res) {
  for (var p in req.body)
    console.log(p);
  console.log('received mail: ' + req.body['stripped-text']);
  
  mg.sendText('robot@mindlier.mailgun.org', [ req.body.sender ],
    'Re: ' + req.body.subject,
    '"' + req.body['stripped-text'] + '"\n\n Säger du det säger du? :-)',
    'robot@mindlier.mailgun.org', {},
    function(err) {
      if (err) console.log('Oh noes: ' + err);
      else     console.log('Success');
  });
  
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('OK');
});

if (process.env.PORT)
  app.listen(process.env.PORT);
else
  app.listen(8888);

//sendText(sender, recipients, subject, text, [servername=''], [options={}], [callback(err)])
var mg = new Mailgun('key-9m8khz3xtf7yz8tkgn05c0yeoed5mtw3');

function addRoute(mail, destination, pattern) {
  mail.getRoutes(function (err, routes) {
    if (err) {
      console.log('Error:', err);
    }
    
    var found = false;
    if (!err) {
      for (var i=0; i<routes.length; i++) {
        if (routes[i].destination == destination) {
          found = true;
        }
      }
    }
    
    if (!found) {
      mail.createRoute(pattern || '', destination, function (err, id) {
        if (err) console.log('Could not create route: ' + err);
        else console.log('Route successfully attached');
      });
    }
  });
}

var destination = 'http://bolero.danielwerthen.mindlier.c9.io/messages';

addRoute(mg, destination, '.*@mindlier.mailgun.org');

mg.sendText('robot@mindlier.mailgun.org', ['Ulf Davidsson <ulf.davidsson@gmail.com>'],
  'Mail from a robot',
  'Nu har jag implementerat mails ifrån och till Node, prova och svara på detta mail vettja!',
  'robot@mindlier.mailgun.org', {},
  function(err) {
    if (err) console.log('Oh noes: ' + err);
    else     console.log('Success');
});