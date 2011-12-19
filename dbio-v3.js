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
      collection.find(query || {}, option || {}, this);
    });
    if (cb)
      s.seq(cb);
      
    return s;
  };
  
  s.insert = function (data) {
    s.seq(function (collection) {
      collection.insert(data, { safe: true }, this);
    });
    return s;
  };
  
  s.remove = function (query, options) {
    s.seq(function (collection) {
      var self = this;
      collection.remove(query, options, function (err) {
        if (err)
          self(err);
        else
          self(null, collection);
      });
    });
    return s;
  };
  
  s.update = function (query, data, options) {
    s.seq(function (collection) {
      options = options || {};
      options.safe = true;
      collection.update(query, data, options, this);
    });
    return s;
  };
  
  s.findAndModify = function (query, sort, data, options) {
    s.seq(function (collection) {
      options = options || { 'new' : true };
      sort = sort || [['_id','ascending']];
      collection.findAndModify(query, sort, data, options, this);
    });
    return s;
  };
  
  s.each = function (cb) {
    s.seq(function (cursor) {
      cursor.each(function (err, item) {
        if (item)
          cb(item);
        else if (err || !item)
          this(err);
      });
    });
    return s;
  };
  
  s.toArray = function () {
    s.seq(function (cursor) {
      cursor.toArray(this);
    });
    return s;
  };
    
  s.findOne = function (query, cb) {
    s
      .seq(function (collection) {
        collection.findOne(query, this);
      })
    ;
    if (cb)
      s.seq(cb);
    return s;
  };
  
  s.parFind = function (col, query, options) {
    s
      .par(function () {
        var self = this;
        db.collection(col, function (err, collection) {
          collection.find(query || {}, options || {}, function (err, cursor) {
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

function each(collection, query, option, cb) {
  dbio
    .open()
    .collection(collection)
    .find(query, option)
    .each(cb)
    .catch(function (error) {
      db(error);
    })
    .close()
  ;
}

function toArray(collection, query, option, cb) {
  dbio
    .open()
    .collection(collection)
    .find(query, option)
    .toArray()
    .seq(cb)
    .close()
  ;
}

exports.each = each;
exports.toArrray = toArray;
exports.open = dbio;
exports.ObjectID = require('mongodb/lib/mongodb/bson/bson').ObjectID;