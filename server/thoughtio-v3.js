var dbio = require('../dbio-v3.js');
var logger = require('../utils/logger');

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



function setup(socket) {
  var user = socket.handshake.session.currentUser;
  
  function sioGetLatestThought(data, fn) {
    getLatestThought(user._id.toString(), function (err, thought) {
      if (err)
        logger.log(err);
      if (fn && thought) {
        fn(thought);
      }
    });
  }
  
  socket.on('getLatestThought', sioGetLatestThought);
}

exports.getLatestThought = getLatestThought;
exports.setup = setup;

