var dbio = require('../dbio-v4.js'),
		types = require('../utils/types');

function getMessage(messageId, callback) {
	if (typeof messageId === 'string') messageId = types.ObjectId(messageId);

	dbio()
		.open()
		.path(function (db) {
			db
				.collection('messages')
				.findOne({ _id: messageId })
				.seq(function (item) {
					callback(null, item);
					this(null);
				})
				.join();
		})
		.close()
		.catch(function (err) {
			callback(err);
		});
}

exports.get = getMessage; // (messageId, callback)
