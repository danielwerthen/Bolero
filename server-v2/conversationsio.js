var conversations = require('./conversations.js'),
		users = require('./users.js'),
		messages = require('./messages.js');


function toString(obj) {
  if (!obj)
    return null;
  else if (obj.toString)
    return obj.toString();
  else if (typeof obj === 'string')
    return obj;
  else
    return null;
}

function setup(socket) {
	var currentUser = socket.handshake.session.currentUser;

	function getConversations(data, fn) {
		users.getConversations(currentUser._id, function (err, convs) {
			if (err)
				console.log(err);
			else
				fn(convs);
		});
	}

	function getMessages(data, fn) {
		var cId = toString(data.conversationId);
		if (cId) {
			conversations.getMessages(cId, function (err, messages) {
				if (err)
					console.log(err);
				else
					fn(messages);
			});
		}
	}

	function getMessage(data, fn) {
		var mId = toString(data.messageId);
		if (mId) {
			messages.get(mId, function (err, message) {
				if (err)
					console.log(err);
				else
					fn(message);
			});
		}
	}

	function addMessage(data, fn) {
		var cId = toString(data.conversationId),
			 	title = toString(data.title),
				message = toString(data.message);
		if( cId && title && message) {
			conversations.addMessage(cId, title, message, currentUser._id, function (err, message) {
				if (err)
					console.log(err);
				else
					fn(message);
			});
		}	
	}

	function newConversation(data, fn) {
		var title = toString(data.title);
		if (title) {
			conversations.newConversation(title, currentUser._id, function (err, conversation) {
				if (err)
					console.log(err);
				else
					fn(conversation);
			});
		}
	}

	socket.on('getConversations', getConversations);
	socket.on('getMessages', getMessages);
	socket.on('getMessage', getMessage);
	socket.on('addMessage', addMessage);
}

exports.setup = setup;
