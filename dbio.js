var mongo = require('mongodb');

function getDb(done) {
  var db = new mongo.Db('BoleroDB', new mongo.Server('staff.mongohq.com', 10048, {}));
  db.open(function (err, db) {
    if (err !== null) {
      done(err, null);
      return;
    }
    db.authenticate('admin', 'Pass09Word', function (err, res) {
      if (res === true) {
        done(null, db);
      }
      else {
        done(err, null);
      }
    });
  });
}


exports.insertDoc = function (collection, thought, callback) {
  getDb(function (err, db) {
    var done = function (err, result) {
        callback(err, result);
        if (db !== undefined) {
          db.close();
        }
      };
    if (db === null) {
      done(err);
      return;
    }
    db.collection(collection, function (err, collection) {
      if (err !== null) {
        done(err);
      }
      else {
        collection.insert(thought, function (err, doc) {
          done(null, doc);
        });
      }
    });
  });
};

exports.findDoc = function findDoc(collection, query, callback) {
  getDb(function (err, db) {
    var done = function (err, result) {
        callback(err, result);
        if (db !== undefined) {
          db.close();
        }
      };
    if (db === null) {
      done(err, null);
      return;
    }
    db.collection(collection, function(err, collection) {
      if (err !== null) {
        done(err, null);
      }
      else {
        collection.find(query, function (err, cursor) {
          if (err !== null) {
            done(err, null);
          }
          else {
            cursor.nextObject(function (err, doc) {
              if (err !== null) {
                done(err);
              }
              else {
                done(err, doc);
              }
            });
          }
        });
      }
    });
  });
};

exports.authenticate = function (username, password, callback) {
  exports.findDoc('users', 
    { username: username, password: password }, 
    function(err, user) {
      if (err !== null || user === null) {
        callback(false);
      }
      else {
        callback(true);
      }
  });
};

exports.foreach = function (collection, callback, query) {
  getDb(function (err, db) {
    var done = function (err, result) {
        callback(err, result);
        if (db !== undefined) {
          db.close();
        }
      };
    if (db === null) {
      done(err, null);
      return;
    }
    db.collection(collection, function (err, collection) {
      if (err !== null) {
        done(err, null);
      }
      else {
        var find = function (err, cursor) {
          if (err !== null) {
            done(err, null);
          }
          else {
            cursor.toArray(function (err, docs) {
              if (err !== null) {
                done(err);
              }
              else {
                done(null, docs);
              }
            });
          }
        };
        if (query === undefined)
          collection.find(find);
        else
          collection.find(query, find);
      }
    });
  });
};

exports.getDocs = function (collection, callback, query) {
  getDb(function (err, db) {
    var done = function (err, result) {
        callback(err, result);
        if (db !== undefined) {
          db.close();
        }
      };
    if (db === null) {
      done(err, null);
      return;
    }
    db.collection(collection, function (err, collection) {
      if (err !== null) {
        done(err, null);
      }
      else {
        var find = function (err, cursor) {
          if (err !== null) {
            done(err, null);
          }
          else {
            if (cursor.toArray === undefined) console.log('error');
            cursor.toArray(function (err, docs) {
              if (err !== null) {
                done(err);
              }
              else {
                done(null, docs);
              }
            });
          }
        };
        if (query === undefined)
          collection.find(find);
        else
          collection.find(query, find);
      }
    });
  });
};