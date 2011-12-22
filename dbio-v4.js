var mongo = require('mongodb'),
    xSeq = require('./lib/xSeq');

function extend(s, db) {
    function _extend(name) {
      s[name] = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        s.seq(function (collection) {
          args[args.length] = this;
          collection[name].apply(collection, args);
        });
        return s;
      };
    }
    
    _extend('find');
    _extend('findAndModify');
    _extend('insert');
    _extend('findOne');
    _extend('group');
    _extend('remove');
    _extend('insertAll');
    _extend('save');
    _extend('update');
    _extend('count');

    _extend('toArray');

    s.collection = function (col) {
      s.seq(function () {
        db.collection(col, this);
      });
      return s;
    }
  return s;
}

function dbio() {
  var self = this,
      username = 'admin',
      password = 'Pass09Word',
      dbname = 'BoleroDB',
      url = 'staff.mongohq.com',
      port = 10048,
      options = {};

  var db = new mongo.Db(dbname, new mongo.Server(url, port, options));

  var s = xSeq();

  s.path = function (cb) {
    s.split(function (path) {
      cb(extend(path, db));
    });
    return s;
  };
  
  s.close = function (cb) {
    s.join();
    s.flatten();
    s.unflatten();
    if (cb)
      s.seq(cb);
    
    s.seq(function () {
      var args = Array.prototype.slice.call(arguments, 0),
          self = this;
      args.splice(0,0, null); //its important to add an null (representing empty exception)
      db.close(function (err) {
        self.apply(self, args);
      });
    });
    return s;
  };

  s.open = function () {
    s
      .seq(function () {
        var callback = this;
        db.open(function (err, result) {
          db.authenticate(username, password, function (err, result) {
            if (result) {
              callback(null); 
            }
            else {
              callback(err); 
            }
          });
        });
      });
    return s;
  };

  return s;
}
module.exports = dbio;