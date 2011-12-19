var dbio = require('../../dbio-v4');

dbio.open(function (err, db) {

	db
	.split(function (path) {
		path
		.split(function (path) {
			path
				.seq(function () {
					console.log('continuing on side path');
					this(null);
				})
				.collection('thoughts')
				.find({}, { skip: 1, limit: 1})
				.toArray()
				.seq(function (thoughts) {
					console.log('Found thought: ' + thoughts[0].title);
					this(null);
				})
				.close()
				.seq(function () {
					console.log('side path closed');
				})
		})
		.seq(function () {
			console.log('continuing on main path');
			this(null);
		})
		.collection('thoughts')
	  .find({})
	  .toArray()
	  .seq(function (thoughts) {
	  	console.log('found ' + thoughts.length + ' number of thoughts');
	  	this(null);
	  })
	  .close()
	  .seq(function () {
	  	console.log('main path closed');
	  });
	})
})