var dbio = require('../dbio-v4.js'),
		barrier = require('../lib/barrier'),
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
					this(null);
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
								callback(null, message);
								self(null);
							}
						});
				})
				.collection('users')
				.update({ _id: userId }, { $addToSet: { conversations: conId }, $inc: { version: 1 } }, { safe: true })
				.join();
		})
		.close()
		.catch(function (err) {
			callback(err);
		});
}

function getMessages(conId, callback) {
	if (typeof conId === 'string') conId = types.ObjectId(conId);
	dbio()
		.open()
		.path(function (db) {
			db
				.collection('conversations')
				.findOne({ _id: conId })
				.collection('messages')
				.seq(function (messages, conv) {
					var self = this;
					var b = barrier(conv.messages.length, function (err, messages) {
						if (err)
							self(err);
						else {
							callback(null, messages);
							self(null, messages);
						}
					});
					for(var i in conv.messages) {
						messages.findOne({ _id: conv.messages[i].messageId }, b);
					}
				})
				.join();
		})
		.close()
		.catch(function (err) {
			callback(err);
		});
}

exports.new = newConversation; // (title, userId, callback)
exports.get = getConversation; // (conversationId, callback)
exports.getMessages = getMessages; // (conversationId, callback)
exports.addMessage = addMessage; // (conversationId, title, message, userId, callback)
