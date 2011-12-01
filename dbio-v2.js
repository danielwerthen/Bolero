var mongo = require('mongodb');

exports = module.exports = function(callback, username, password, dbname, url, port, options) {
  username = username || 'admin';
  password = password || 'Pass09Word';
  dbname = dbname || 'BoleroDB';
  url = url || 'staff.mongohq.com';
  port = port || 10048;
  options = options || {};
  var db = new mongo.Db(dbname, new mongo.Server(url, port, options));
  db.open(function (err, db) {
    if (err !== null) {
      callback(err, null);
      return;
    }
    db.authenticate(username, password, function (err, res) {
      if (res === true) {
        var res = { foreach: function (collection, query, callback) {
            db.collection(collection, function(err, collection) {
              if (err)
                callback(err);
              else {
                collection.find(query, function(err, cursor) {
                  if (err)
                    callback(err);
                  else {
                    cursor.each(function(err, item) {
                      callback(err, item);
                    });
                  }
                });
              }
            });
          },
          toArray: function (collection, query, callback) {
            db.collection(collection, function(err, collection) {
              if (err)
                callback(err);
              else {
                collection.find(query, function(err, cursor) {
                  if (err)
                    callback(err);
                  else {
                    cursor.toArray(function(err, items) {
                      callback(err, items);
                    });
                  }
                });
              }
            });
          },
          insert: function (collection, item, callback) {
            db.collection(collection, function (err, collection) {
              if (err !== null) {
                done(callback);
              }
              else {
                collection.insert(item, function (err, doc) {
                  callback(err, doc);
                });
              }
            });
          }
        }
        callback(err, res);
      }
      else {
        callback(err);
      }
    });
  });
};
