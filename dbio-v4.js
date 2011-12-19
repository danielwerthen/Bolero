var mongo = require('mongodb'),
    Seq = require('seq');

function extendedSeq(parent, db) {
  var s = Seq();
    function extend(name) {
      s[name] = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        s.seq(function (collection) {
          args[args.length] = this;
          collection[name].apply(collection, args);
        });
        return s;
      };
    }
    
    extend('find');
    extend('findAndModify');
    extend('insert');
    extend('findOne');
    extend('group');
    extend('remove');
    extend('insertAll');
    extend('save');
    extend('update');
    extend('count');

    extend('toArray');

    var paths = [];
    s.split = function (cb) {
      s.seq(function (data) {
        var path = extendedSeq(s, db);
        cb(path, data);
        paths.push(path);
        this(null);
      });
      return s;
    };

    s.collection = function (col) {
      s.seq(function () {
        db.collection(col, this);
      });
      return s;
    }

    var looseEnds = [];
    s.close = function (path) {
      s.seq(function () {
        if (path) {
          console.log('remove a path')
          var idx = paths.indexOf(path);
          if (idx !== -1) {
            paths.splice(idx, 1);
          }
        }

        if (paths.length === 0) {
          console.log('will close now')
          parent.close(s);
          this(null); 
          for (var i in looseEnds) {
            looseEnds[i]();
          }
        }
        else {
          looseEnds.push(function () {
            s.close();
          });
          console.log('cant close, wait for side paths to close first');
        }
      });
      return s;
    };
  return s;
}

function dbio(callback) {
  var self = this,
      username = 'admin',
      password = 'Pass09Word',
      dbname = 'BoleroDB',
      url = 'staff.mongohq.com',
      port = 10048,
      options = {};

  var db = new mongo.Db(dbname, new mongo.Server(url, port, options));

  self.split = function (cb) {
    var es = extendedSeq(self, db);
    cb(es);
  };
  
  self.close = function (cb) {
    db.close(function (err) {
      if (cb)
        cb(err);
    });
  };
  db.open(function (err, result) {
    db.authenticate(username, password, function (err, result) {
      if (result) {
        callback(null, self); 
      }
      else {
        callback(err); 
      }
    });
  })
}
exports.open = dbio;