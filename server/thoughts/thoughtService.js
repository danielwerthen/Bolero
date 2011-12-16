var dbio = require('../../dbio-v3.js');

function getLatestThought(userId, cb) {
  dbio
    .open()
    .collection('thoughts')
    .find({ userId: userId }, { sort: { 'createDate': -1 }, limit: 1})
    .toArray()
    .seq(function (thought) {
      cb(null, Array.isArray(thought) ? thought[0] : thought);
      this(null);
    })
    .catch(function (error) {
      cb(error);
    })
    .close()
  ;
}

function getThought(thoughtId, cb) {
  dbio
    .open()
    .collection('thoughts')
    .findOne({ _id: dbio.ObjectID(thoughtId) }, function (thought) {
      cb(null, thought);
      this(null);
    })
    .catch(function (error) {
      cb(error);
    })
    .close();
}

function getThoughts(query, options, cb) {
  dbio
    .open()
    .collection('thoughts')
    .find(query, options)
    .toArray()
    .seq(function (thoughts) {
      cb(null, thoughts);
      this(null);
    })
    .catch(function (err) {
      cb(err);
    })
    .close();
}

function insertThought(thought, cb) {
  dbio
    .open()
    .collection('thoughts')
    .insert(thought)
    .seq(function (result) {
      cb(null, result);
      this(null);
    })
    .close();
}

exports.getLatestThought = getLatestThought;
exports.getThought = getThought;
exports.getThoughts = getThoughts;
exports.insertThought = insertThought;