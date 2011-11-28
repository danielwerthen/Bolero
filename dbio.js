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
    if (db === null) {
      done(err);
      return;
    }
    var done = function (err, result) {
        callback(err, result);
        if (db !== undefined) {
          db.close();
        }
        };
    db.collection(collection, function (err, collection) {
      if (err !== null) {
        done(err);
      }
      else {
        collection.insert(thought, function (thoughts) {
          done(null);
        });
      }
    });
  });
};

exports.getDocs = function (collection, callback) {
  getDb(function (err, db) {
    if (db === null) {
      done(err, null);
      return;
    }
    var done = function (err, result) {
        callback(err, result);
        if (db !== undefined) {
          db.close();
        }
        };
    db.collection(collection, function (err, collection) {
      if (err !== null) {
        done(err, null);
      }
      else {
        collection.find(function (err, cursor) {
          if (err !== null) {
            done(err, null);
          }
          else {
            if (cursor.toArray === undefined) console.log('error');
            cursor.toArray(function (err, thoughts) {
              if (err !== null) {
                done(err);
              }
              else {
                done(null, thoughts);
              }
            });
          }
        });
      }
    });
  });
};