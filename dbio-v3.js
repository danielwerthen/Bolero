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
  
  s.collection = function (col, cb) {
    s.seq(function () {
        db.collection(col, this);
      });
    if (cb)
      s.seq(cb);
    return s;
  };
  
  s.find = function (query, option, cb) {
    if (cb === undefined && typeof option === 'function') {
      cb = option;
      option = undefined;
    }
    s.seq(function (collection) {
      collection.find(query, option, this);
    });
    if (cb)
      s.seq(cb);
      
    return s;
  };
    
  s.findOne = function (query, cb) {
    s
      .seq(function (collection) {
        collection.findOne(query, this);
      })
      .seq(cb)
    ;
    return s;
  };
  
  s.parFind = function (col, query, options) {
    s
      .par(function () {
        var self = this;
        db.collection(col, function (err, collection) {
          collection.find(query, options || {}, function (err, cursor) {
            cursor.toArray(self);
          });
        });
      })
    ;
    return s;
  };
  
  s.parFindOne = function (col, query) {
    s
      .par(function () {
        var self = this;
        db.collection(col, function (err, collection) {
          collection.findOne(query, function (err, t) {
              self(err, t);
            });
        });
      })
    ;
    return s;
  };
  
  s.close = function () {
    s
      .seq(function () {
        db.close();
      })
    ;
  };
  
  return s;

}

exports.open = dbio;
exports.ObjectID = require('mongodb/lib/mongodb/bson/bson').ObjectID;