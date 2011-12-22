var dbio = require('../../dbio-v4');

dbio()
	.open()
	.path(function (db) {
		db
			.seq(function (t) {
				this(null);
			})
			.collection('thoughts')
			.find()
			.toArray()
			.seq(function (thoughts) {
				console.log('query 1 done');
				this(null, thoughts)
			})
			.join();
	})
	.close();