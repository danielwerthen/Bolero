var Seq = require('seq');
var Hash = require('./node_modules/seq/node_modules/hashish');
var dbio = require('./dbio-v3.js');
var barrier = require('./lib/barrier');

dbio.find('thoughts', { })
  .seq(function (cursor) {
    cursor.limit(3, this);
  })
  .seq(function (cursor) {
    cursor.each(barrier(this));
  })
  .flatten()
  .parEach(function (items) {
    console.dir(items.title);
    this(null);
  })
  .seq(function () {
    console.log('close');
    this.vars.db.close();
  })
;