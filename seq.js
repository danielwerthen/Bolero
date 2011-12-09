var Seq = require('seq');
var Hash = require('./node_modules/seq/node_modules/hashish');
  
Seq()
    .seq(function () {
        this(null, [1,2,3,4,5]);
    })
    .flatten()
    .parEach(function (i) {
        console.log(i);
        this.into(i)(null, 4);
    })
    .seq(function () {
      console.log(this.vars);
        var sizes = Hash.map(this.vars, function (s) { return s.size });
        console.dir(sizes);
    })
;