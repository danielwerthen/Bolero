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

exports.getLatestThought = getLatestThought;