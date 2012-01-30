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

		var cache = {};
		function emit(method, data, fn) {
			if (connected) {
				if (!cache[method])
					cache[method] = {};
				var key = JSON.stringify(data);
				if (!cache[method][key]) {
					sio.emit(method, data, function (res) {
						cache[method][key] = res;
						fn(res);
					});
				}
				else {
					fn(cache[method][key]);
				}
			}
			else
				queue.push(function () {
					emit(method, data, fn);
				});
		}

		return {
			emit: emit
		};
	}
);
