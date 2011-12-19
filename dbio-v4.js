var mongo = require('mongodb'),
    Seq = require('seq');

function dbio(username, password, dbname, url, port, options) {
  username = username || 'admin';
  password = password || 'Pass09Word';
  dbname = dbname || 'BoleroDB';
  url = url || 'staff.mongohq.com';
  port = port || 10048;
  options = options || {};

  var db = new mongo.Db(dbname, new mongo.Server(url, port, options));
  var s = Seq().seq(function() {
    db.open(this);
  }).seq(function(db) {
    this.vars.db = db;
    db.authenticate(username, password, this);
  }).seq(function(result) {
    if (result === false) {
      this('DB authentication failed');
    }
    else {
      this(null, this.vars.db);
    }
  });
  
  s.collection = function (col) {
    s.seq(function () {
      var self = this;
      db.collection(col, function (err, collection) {
        self(err, collection);
      });
    });
    return s;
  };
  
  s.find = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    args[1] = this;
    console.dir(args);
    s.seq(function (collection) {
      collection.find(args[0], args[1]);
    });
    return s;
  };
  
  s.toArray = function () {
    s.seq(function (cursor) {
      cursor.toArray(this);
    });
    return s;
  };
  
  s.close = function (cb) {
    s
      .seq(function () {
        var self = this;
        db.close(function (err) {
          if (cb)
            cb();
          self(err);
        });
      })
    ;
    return s;
  };
  return s;
}
exports.open = dbio;