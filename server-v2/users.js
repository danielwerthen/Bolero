var dbio =  require('../dbio-v4.js'),
		barrier = require('../lib/barrier'),
		types = require('../utils/types');


function newUser(email, callback) {
	var user = {
		createDate: new Date(),
		email: email,
		version: 1,
		conversations: []
	};

	dbio()
		.open()
		.path(function (db) {
			db
				.collection('users')
				.insert(user)
				.flatten()
				.seq(function (user) {
					callback(null, user);
					this(null);
				})
				.join();
		})
		.close()
		.catch(function (err) {
			callback(err);
		});
}

function getUser(userId, callback) {
	if (typeof userId === 'string') userId = types.ObjectId(userId);
	dbio()
		.open()
		.path(function (db) {
			db
				.collection('users')
				.findOne({ _id: userId })
				.seq(function (user) {
					callback(null, user);
					this(null);
				})
				.join();
		})
		.close()
		.catch(function (err) {
			callback(err);
		});
}

exports.new = newUser; // (email, callback)
exports.get = getUser; // (userId, callback)
