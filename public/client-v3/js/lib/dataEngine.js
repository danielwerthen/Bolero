define(
	[ "/socket.io/socket.io.js" ]
	, function () {
		var sio = io.connect('http://' + document.location.host + '/bolero')
			, connected = false
			, queue = [];

		sio.on('connect', function () {
			console.log('connected through socket.io');
			connected = true;
			for (var i in queue) {
				queue[i]();
			}
			queue = [];
		});

		sio.on('error', function (err) {
			connected = false;
			if (err == 'handshake error') {
				window.location = '/login';
			}
			else {
				setTimeout(function () {
					sio.socket.connect();
				}, 500);
			}
		});

		function emit(method, data, fn) {
			if (connected)
				sio.emit(method, data, fn);
			else
				queue.push(function () {
					sio.emit(method, data, fn);
				});
		}

		return {
			emit: emit
		};
	}
);
