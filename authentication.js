var url = require('url');
var db = require('./dbio-v2');

exports = module.exports = function authentication(options){
  options = options || {};
  return function authentication(req, res, next) {
    var parts = url.parse(req.url, true);

    // ####
    // Logout
    if (parts.pathname == "/logout" ) {
      req.session.destroy();
      if (options.redirect === true)
        res.redirect('/login');
      else
        res.end();
      return;
    }
    if (parts.pathname == "/login" && req.method == 'GET') {
      next();
      return;
    }
    
    if (parts.pathname == "/registrate") {
      if (req.method == 'GET')
        next();
      else if (req.method == 'POST') {
        var user = { username: req.body.user.name,
          password: req.body.user.password,
          email: req.body.user.email };
        db.insertDoc('users', user, function(err, userDoc) {
          req.session.currentUser = userDoc;
          req.session.auth = true;
          next();
        });
      }
      return;
    }

    // ####
    // Is User already validated?
    if (req.session && req.session.auth === true) {
      next(); // stop here and pass to the next onion ring of connect
      return;
    }

    // ########
    // Auth - Replace this simple if with you Database or File or Whatever...
    // If Database, you need a Async callback...
    if (parts.pathname == "/login" && req.method == 'POST') {
      db.findDoc('users', 
        { username: req.body.username, password: req.body.password }, 
        function(err, user) {
          if (err !== null || user === null) {
            if (options.redirect === true)
              res.redirect('/login');
            else
              res.end();
            return;
          }
          else {
            req.session.currentUser = user;
            req.session.auth = true;
            next();
            return;
          }
      });
    }
    else {
      if (options.redirect === true)
          res.redirect('/login');
        else
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({ authorized: false }));
      return;
    }
  };
};