var dbio = require('../dbio-v4.js'),
		barrier = require('../lib/barrier'),
		types = require('../utils/types');

function insertNetwork(title, userId, cb) {
	if (typeof userId === 'string') userId = types.ObjectId(userId);
	var network = {
		createDate: new Date(),
		title: title,
		createdBy: userId,
		version: 1,
		users: [ userId ]
	};		
  dbio()
    .open()
		.path(function (db) {
			db
				.collection('networks')
				.insert(network)
				.flatten()
				.split(function (db2) {
					db2
						.collection('users')
						.seq(function (collection, network) {
							collection.update({ _id: userId }, { $addToSet: { networks: network._id }, $inc: { version: 1 } }, { safe: true }, this);
						})
						.flush()
						.join();
				})
			.join();
		})
    .close()
		.seq(function (nw) {
			console.dir(nw);
			cb(null, nw);
		})
		.catch(function (err) {
			cb(err);
		});
}

function insertUser(userId, networkId, cb) {
	if (userId && networkId) {
		if (typeof networkId === 'string') networkId = types.ObjectId(networkId);
		if (typeof userId === 'string') userId = types.ObjectId(userId);
		var upd = { $addToSet: { users: userId }, $inc: { version: 1 } },
				query = { _id: networkId };
		dbio()
			.open()
			.path(function (db) {
				db
					.collection('networks')
					.findAndModify(query, [[ '_id', 'ascending' ]], upd, { new: true })
				.join();
			})
			.path(function (db) {
				db
					.collection('users')
					.findAndModify({ _id: userId }, [[ '_id', 'ascending' ]], 
						{ $addToSet: { networks: networkId }, $inc: { version: 1 } },
						{ new: true })
					.flush()
					.join();
			})
		.close()
		.seq(function (network) {
			cb(null, network);
		})
		.catch(function (err) {
			cb(err);
		});
	}
}

function getNetwork(networkId, cb) {
	if (networkId) {
		if (typeof networkId === 'string') networkId = types.ObjectId(networkId);
		dbio(function (err, db) {
			if (err) {
				cb(err);
				return;
			}
			db.collection('networks', function (err, collection) {
				if (err) {
					cb(err);
					db.close();
					return;
				}
				collection.findOne({ _id: networkId }, function (err, network) {
					db.close();
					if (err)
						cb(err);
					else
						cb(null, network);
				});
			});
		});
	}
}

function getUsers(networkId, cb) {
	if (networkId) {
		if (typeof networkId === 'string') networkId = types.ObjectId(networkId);
		dbio()
			.open()
			.path(function (db) {
				db
					.collection('networks')
					.findOne({ _id: networkId })
					.split(function (db2) {
						db2
							.seq(function (network) {
								var self = this;
								db2.expose.collection('users', function (err, collection) {
									var b = barrier(network.users.length, self);
									for (var i in network.users) {
										var userId = network.users[i];
										if (typeof userId === 'string') {
											userId = types.ObjectId(userId);
										}
										collection.findOne({ _id: userId }, function (err, user) {
											b(null, user);
										});
									}
								});
							})
							.join();
					})
					.flush()
					.join();
			})
		.close()
		.seq(function (networks) {
			cb(null, networks);
		})
		.catch(function (err) {
			cb(err);
		});
	}
}

exports.insert = insertNetwork;
exports.insertUser = insertUser;
exports.getUsers = getUsers;
exports.get = getNetwork;
