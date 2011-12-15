var Seq = require('seq');
var dbio = require('./dbio-v3.js');
var barrier = require('./lib/barrier');
var tio = require('./server/thoughtio-v3');
var userService = require('./server/users/userService.js');
var thoughtService = require('./server/thoughts/thoughtService');

userService.getUsers(function (err, users) {
  console.log('got ' + users.length + ' users, first of which is ' + users[0].username);
  var user = users[0];
  userService.getUser(user._id.toString(), function (err, user) {
    console.log('Found the first user again: ' + user.username);
    thoughtService.getLatestThought(user._id.toString(), function (err, thought) {
      console.log('Successfully extracted the latest thought: ' + thought.title + ' {' + thought.content + '}');
    });
  });
});
/*dbio.find('thoughts', { })
  .seq(function (cursor) {
    cursor.limit(3, this);
  })
  .seq(function (cursor) {
    cursor.each(barrier(this));
  })
  .flatten()
  .parEach(function (items) {
    console.dir(items.title);
    this(null);
  })
  .seq(function () {
    console.log('close');
    this.vars.db.close();
  })
;

dbio
  .open()
  .parFind('users', {})
  .parFind('thoughts', {})
  .seq(function (users, thoughts) {
    console.dir(users);
    console.dir(thoughts);
    this(null);
  })
  .close()
;

dbio
  .seq()
  .parFindOne('thoughts', { _id: dbio.ObjectID('4ede685bdf0caf7b6a000006') })
  .parFindOne('thoughts', { _id: dbio.ObjectID('4ede6866df0caf7b6a00000b') })
  .parFind('thoughts', { title: 'Parent thought' })
  .flatten()
  .seq(function (a, b, c) {
    console.log(a.createDate + ' to ' + b.createDate + ' and ' + c.length);
    this(null);
  })
  .close()
;*/

/*dbio()
  .collection('users')
  .findOne({}, function (user) {
    this.vars.user = user;
    this.vars.db.collection('thoughts', this);
  })
  .seq(function (collection) {
    collection.find({ userId: this.vars.user._id.toString(), title: 'Parent thought' }, { sort: { 'createDate': -1 }}, this);
  })
  .seq(function (cursor) {
    cursor.toArray(this);
  })
  .seq(function (thoughts) {
    console.dir(thoughts);
    this(null);
  })
  .close()
;*/