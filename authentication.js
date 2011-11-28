var url = require('url');
var db = require('./dbio');

exports = module.exports = function authentication(options){
  options = options || {};
  return function authentication(req, res, next) {
    var parts = url.parse(req.url, true);

    // ####
    // Logout
    if (parts.pathname == "/logout" ) {
      req.session.destroy();
    }
    
    if (parts.pathname == "/registrate") {
      if (req.method == 'GET')
        next();
      else if (req.method == 'POST') {
        var user = { username: req.body.user.name,
          password: req.body.user.password,
          email: req.body.user.email };
        db.insertDoc('users', user, function(err, 
        req.session.auth = true;
        next();
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
    if (parts.pathname == "/login" && 
        req.method == 'POST' &&
        parts.query.name == "max" && 
        parts.query.pwd == "herewego" ) {
      req.session.auth = true;
      next();
      return;
    }

    // ####
    // User is not unauthorized. Stop talking to him.
    res.writeHead(403);
    res.end('Sorry you are unauthorized.\n\nFor a login use: /login?name=max&pwd=herewego');
    return;
  };
};