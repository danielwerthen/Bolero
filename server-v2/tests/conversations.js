var users = require('../users.js'),
		conversations = require('../conversations.js'),
		messages = require('../messages.js');
console.log('initiating test of conversations.js');

users.new('test01@test.com', function (err, user) {
	console.log('added test user 1');
	conversations.new('test conversation', user._id, function (err, conv) {
		if (err) console.log(err);
		console.log('added conversation 1');
		conversations.addMessage(conv._id, 'Test message', 'Says hello', user._id, function (err, message) {
			if (err) console.log(err);
			console.log('added message 1');
			users.new('test02@test.com', function (err, user2) {
				console.log('added test user 2');
				conversations.addMessage(conv._id, 'Test message 2', 'Says hello 2', user2._id, function (err, message) {
					console.log('added message 2');
					conversations.get(conv._id, function (err, conv) {
						console.log('got conversation 1 with: ' + conv.messages.length + ' messages');
						conversations.getMessages(conv._id, function (err, _messages) {
							console.log('got the messages of conv 1, total number of: ' + _messages.length);
							messages.get(_messages[0]._id, function (err, message) {
								console.log('even getMessage returned successfully!');
							});
						});
					});
				});
			});
		});
	});
});
