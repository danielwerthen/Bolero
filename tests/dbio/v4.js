var dbio = require('../../dbio-v4');

dbio()
	.open()
	.path(function (db) {
		db
			.seq(function (t) {
				this(null);
			})
			.collection('thoughts')
			.find({}, {limit: 1})
			.toArray()
			.split(function (db2) {
				db2
					.seq(function (thought) {
						console.log('Split 1 found:');
						console.dir(thought);
						this(null, 'split 1 done');
					})
					.join();
			})
			.split(function (db2) {
				db2
					.seq(function (thought) {
						console.log('Split 2 found:');
						console.dir(thought);
						this(null, 'split 2 done');
					})
					.join();
			})
			.seq(function (thoughts) {
				console.log('query 1 done');
				this(null, thoughts)
			})
			.join();
	})
	.close()
	.seq(function (thought) {
		console.dir(thought);
	});