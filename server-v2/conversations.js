var dbio = require('../dbio-v4.js'),
		barrier = require('../lib/barrier),
		types = require('../utils/types');

function newConversation(title, userId, callback) {
	if (typeof userId === 'string') userId = types.ObjectId(userId);
	var conv = {
		createDate: new Date(),
		title: title,
		createdBy: userId,
		version: 1,
		users: [ userId ],
		messages: []
	};

	dbio()
		.open()
		.path(function (db) {
			db
				.collection('conversations')
				.insert(conv)
				.flatten()
				.collection('users')
				.seq(function (collection, conv) {
					var self = this;
					collection.update({ _id: userId }, { $addToSet: { conversations: conv._id }, $inc: { version: 1 }}, { safe: true }, function (err) {
						if (err)
							self(err);
						else
							self(null, conv);
					});
				})
				.join();
		})
		.close()
		.seq(function (c) {
			callback(null, c);	
		})
		.catch(function (err) {
			callback(err);
		});
}

function getConversation(conId, callback) {
	if (typeof conId === 'string') conId = types.ObjectId(conId);
	dbio()
		.open()
		.path(function (db) {
			db
				.collection('conversations')
				.findOne({ _id: conId })
				.seq(function (conv) {
					callback(null, conv);
				})
				.join();
		})
		.close()
		.catch(function (err) {
			callback(err);
		});
}

function addMessage(conId, title, message, userId, callback) {
	if (typeof conId === 'string') conId = types.ObjectId(conId);
	var _message = {
		createDate: new Date(),
		createdBy: userId,
		title: title,
		message: message,
		conversationId: conId
	};
	dbio()
		.open()
		.path(function (db) {
			db
				.collection('messages')
				.insert(_message)
				.flatten()
				.collection('conversations')
				.seq(function (conversations, message) {
					var self = this;
					conversations.findAndModify({ _id: conId }, [[ '_id', 'ascending' ]],
						{ $addToSet: { messages: { linkDate: new Date(), messageId: message._id } },
							$inc: { version: 1 } },
						{ new: true }, function (err, result) {
							if (err)
								self(err);
							else {
								callback(message);
								self(null);
							}
						});
				})
				.join();
		})
		.close()
		.catch(function (err) {
			callback(err);
		});
}

function getMessages(conId, centerMessageId, forward, backward, callback) {
	if (typeof conId === 'string') conId = types.ObjectId(conId);
	dbio()
		.open()
		.path(function (db) {
			db
				.collection('conversations')
				.findOne({ _id: conId })
				.collection('messages')
				.seq(function (messages, conv) {
					var center,
							_forwards = [],
							_backwards = [];
					for (var i in conv.messages) {
						if (conv.messages[i].messageId === centerMessageid)
							center = conv.messages[i].linkDate;
					}
					if (!center)
						callback('Message not found');
					
				})
				.join();
		})
		.close()
		.catch(function (err) {
			callback(err);
		});
}
