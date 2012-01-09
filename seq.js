var data = require('./dataloader.js'),
		users = require('./server-v2/users.js'),
		convos = require('./server-v2/conversations.js');

users.getByEmail('danielwerthen@gmail.com', function (err, user) {
	convos.new(data.getTitle(), user._id, function (err, convo) {
		for(var i = 0; i < 15; i++) {
			convos.addMessage(convo._id, data.getTitle(), data.getParagraph(), user._id, function (err, message) {
				console.dir(message);
			});
		}
	});
});

/*var s = xSeq();

s
  .seq(function () {
    this.vars.name = 'Daniel';
    this(null, 'kalle');
  })
  .split(function (s2) {
    s2
      .seq(function ()
      {
        console.dir(this.vars);
        this(null);
      })
      .split(function (s21) {
        s21
          .seq(function (data) {
            var self = this;
            setTimeout(function () {
              self(null, self.vars.name);
              console.log(self.vars.name + ' has left the building');
            }, 1500);
          })
          .join();
      })
      .split(function (s22) {
        s22
          .seq(function (data) {
            this(null, 'Johan');
            console.log('Johan has left the building');
          })
          .join();
      })
      .seq(function (data) {
        var ret = this;
        setTimeout(function() {
          ret(null, 'Olle');
          console.log('Olle has left the building');
        }, 1000);
      })
      .join();
  })
  .split(function (s3) {
    s3
      .seq(function (data) {
        this(null, 'Anna');
        console.log('Anna has left the building');
      })
      .join();
  })
  .seq(function (data) {
    this(null);
  })
  .join()
  .flatten()
  .unflatten()
  .seq(function (result) {
    console.dir(result);
  });*/










/*userService.getUsers(function (err, users) {
  //console.log('got ' + users.length + ' users, first of which is ' + users[0].username);
  var user = users[0];
  userService.getUser(user._id.toString(), function (err, user) {
    //console.log('Found the first user again: ' + user.username);
    thoughtService.getLatestThought(user._id.toString(), function (err, thought) {
      //console.log('Successfully extracted the latest thought: ' + thought.title + ' {' + thought.content + '}');
    });
    
    thoughtService.getThoughts({userId: user._id.toString()}, { sort: { createDate: -1 }}, function (err, thoughts) {
      //console.log('GetThoughts returned: ' + thoughts.length + ' thoughts');
      for (var i in thoughts) {
        var thought = thoughts[i];
        console.dir({ fromId: 'T' + thought._id.toString() });
        linkService.getLinks({ fromId: 'T' + thought._id.toString() }, (function(t) {
          return function (err, links) {
            console.log(links.length);
            //console.log('T' + t + ' is linked to ' + linq.select(links, function (l) { return l.toId }).join(', ') + ' other thoughts');
          };
        })(thought._id.toString()));
      }
    });
  });
});

console.dir({ fromId: 'T4ede67ad1a8b599d5f000027' });
linkService.getLinks({ fromId: 'T4ede67ad1a8b599d5f000027' }, function (err, result) {
  //console.dir(result);
});

linkService.insertLink('T4ede67ad1a8b599d5f000027', 'T4ede6866df0caf7b6a00000d', function (err, result) {
  console.dir(result);
});*/


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
