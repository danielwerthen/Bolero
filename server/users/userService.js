var dbio = require('../../dbio-v3.js');

function getUser(userId, cb) {
  dbio
    .open()
    .collection('users')
    .findOne({ _id: dbio.ObjectID(userId) })
    .seq(function (user) {
      cb(null, user);
      this(null);
    })
    .catch(function (error) {
      cb(error);
    })
    .close()
  ;
}

function getUsers(cb) {
  dbio
    .open()
    .collection('users')
    .find({}, {})
    .toArray()
    .seq(function (users) {
      cb(null, users);
      this(null);
    })
    .catch(function (err) {
      cb(err);
    })
    .close()
  ;
}

function insertUser(user, cb) {
  dbio
    .open()
    .collection('users')
    .insert(user)
    .seq(function (result) {
      cb(null, result);
      this(null);
    })
    .close();
}

exports.getUser = getUser;
exports.getUsers = getUsers;
exports.insertUser = insertUser;