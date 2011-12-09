var dbio = require('../dbio-v3.js');
var barrier = require('../lib/barrier');

function getLatestThought(cb, userId) {
  dbio.collection('thoughts')
  .seq(function (collection) {
    collection.findOne({ 
      userId = userId 
    }, {
      "sort": ['createDate','desc']
    }, this);
  })
  .seq(function (thought) {
    cb(thought);
  })
}