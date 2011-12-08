var db = require('../dbio-v2');

function fail(res) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify({ authorized : false }));
}

function approve(res) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify({ authorized : true }));
}

exports.post = function (req, res) {
  if (req.body.username && req.body.password) {
    db(function (err, db) {
      if (err || !db)
        fail(res);
      else {
        db.toArray('users', {username: req.body.username, password: req.body.password}, function (err, user) {
          if (err || user.length == 0) {
            fail(res);
          }
          else {
            req.session.currentUser = user[0];
            req.session.auth = true;
            approve(res);
          }
        });
      }
    });
  }
  else {
    fail(res);
  }
};
      
      
      