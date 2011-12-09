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
  return Seq().seq(function () {
    db.open(this);
  }).seq(function (db) {
    this.vars.db = db;
    db.authenticate(username, password, this);
  }).seq(function (result) {
    if (result === false) {
      this('DB authentication failed');
    }
    else {
      this(null, this.vars.db);
    }
  });

}

function collection(col) {
  return dbio().seq(function (db) {
    db.collection(col, this);
  });
}

function find(col, query) {
  return collection(col).seq(function (collection) {
    collection.find(query, this);
  });
}

exports.Seq = dbio;
exports.collection = collection;
exports.find = find;
exports.ObjectID = require('mongodb/lib/mongodb/bson/bson').ObjectID;