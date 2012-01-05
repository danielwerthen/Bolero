var networks = require('./networks.js'),
		dbio = require('../dbio-v4.js');

function finalize() {
	dbio(function (err, db) {
		db.collection('networks', function (err, collection) {
			collection.remove({ title: 'Test network'}, function (err, result) {
				console.log('Test networks removed');
				db.close(function () {
					console.log('closed');
				});
			});
		});
	});
}
var userId1 = '4ed38cda7617b7680a000001';
var userId2 = '4ed54e1a3733af7234000001';
var t0 = new Date().getTime();
networks.insert('Test network', userId1, function (err, network) {
	networks.insertUser(userId2, network._id, function (err, network2) {
		var t3 = new Date().getTime();
		networks.get(network._id, function (err, network3) {
			var t4 = new Date().getTime();
			console.log('Getting one user took a total of: ' + (t4 - t3) + 'ms');
		});
		var t1 = new Date().getTime();
		networks.getUsers(network._id, function (err, users) {
			var t2 = new Date().getTime();
			console.log('Inserting and updating took a total of: ' + (t1 - t0) + 'ms');
			console.log('Getting users from one network took a total of: ' + (t2 - t1) + 'ms');
			console.dir(users);
			finalize();
		});
	});
});

