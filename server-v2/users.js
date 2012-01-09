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

function getUserByEmail(email, callback) {
	dbio()
		.open()
		.path(function (db) {
			db
				.collection('users')
				.findOne({ email: email })
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

function getConversations(userId, callback) {
	if (typeof userId === 'string') userId = types.ObjectId(userId);
	dbio()
		.open()
		.path(function (db) {
			db
				.collection('users')
				.findOne({ _id: userId })
				.collection('conversations')
				.seq(function (convs, user) {
					if (!user.conversations || user.conversations.length == 0) {
						callback(null, []);
						this(null);
						return;
					}
					var self = this,
							b = barrier(user.conversations.length, function (err, items) {
								callback(err, items);
								self(null);
							});
					for(var i in user.conversations) {
						convs.findOne({ _id: user.conversations[i] }, b);
					}
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
exports.getConversations = getConversations; // (userId, callback)
exports.getByEmail = getUserByEmail; // (email, callback)
