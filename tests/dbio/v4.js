var dbio = require('../../dbio-v4');

dbio
  .open()
  .collection('thoughts')
  .find({})
  .toArray()
  .seq(function (thoughts) {
    console.dir(thoughts);
    this(null);
  })
  .close();