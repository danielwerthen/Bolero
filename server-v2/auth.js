var dbio = require('../dbio-v4.js');

function fail(res) {
	res.redirect('/index');
}

function approve(res) {
	res.redirect('/index');
}

function login(user, req, res) {
	console.log('connected user through login');
	req.session.currentUser = user;
	req.session.auth = true;
}

exports.logout = function (redirect) {
	return function (req, res) {
		req.session.destroy();
		res.redirect(redirect);
	}
}

exports.post = function (req, res) {
  if (req.body.email && req.body.password) {
		dbio()
			.open()
			.path(function (db) {
				db
					.collection('users')
					.findOne({ email: req.body.email, password: req.body.password})
					.seq(function (user){
						if (user) {
							login(user, req, res);
							approve(res);
						}
						else
							fail(res);
						this(null);
					})
					.catch(function (err) {
						fail(res);
					})
					.join();
			})
			.close()
			.catch(function (err) {
				fail(res);
			});
  }
  else {
    fail(res);
  }
};

exports.get = function (req, res) {
	res.render('index');
};

exports.getRegister = function (req, res) {
	res.render('register');
};
      
exports.postRegister = function (req, res) {
	if (req.body.user.email && req.body.user.password) {
		console.log('hej');
		dbio()
			.open()
			.path(function (db) {
				db
					.collection('users')
					.findOne({ email: req.body.user.email })
					.seq(function (user) {
						console.log('found ' + user);
						if (user) {
							fail(res);
							this(null, false);
						}
						else {
							this(null, true);
						}
					})
					.catch(function (err) {
						console.log(err);
						this(null, true);
					})
					.collection('users')
					.seq(function (users, con) {
						console.log(con);
						if (con) {
							var user = {
								createDate : new Date(),
								email : req.body.user.email,
								password : req.body.user.password,
								version : 1
							};
							var self = this;
							users.insert(user, function (err, results) {
								if (err)
									self(err);
								else {
									login(user, req, res);
									approve(res);
									self(null);
								}
							});
						}
						else
							this(null);
					})
					.catch(function (err) {
						fail(res);
					})
					.join();
			})
			.close()
			.catch(function (err) {
				fail(res);
			});
	}
	else {
		fail(res);
	}
};	
      
