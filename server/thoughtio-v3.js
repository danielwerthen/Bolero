var dbio = require('../dbio-v3.js');
var logger = require('../utils/logger');
var users = require('../server/users/userService.js');
var thoughts = require('../server/thoughts/thoughtService.js');
var links = require('../server/links/linkService.js');

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
  var user = socket.handshake.session.currentUser;
  
  function callback(fn) {
    return function (err, data) {
      if (err)
        logger.log(err);
      if (fn && data)
        fn(data);
    };
  }
  
  function sioGetLatestThought(data, fn) {
    var userId = toString(data._id || data.userId);
    thoughts.getLatestThought(userId, callback(fn));
  }
  
  function sioGetUser(data, fn) {
    var userId = toString(data._id || data.userId);
    users.getUser(userId, callback(fn));
  }
  
  function sioGetUsers(data, fn) {
    users.getUsers(callback(fn));
  }
  
  function sioInsertUser(data, fn) {
    if (data.username && data.email && data.password) {
      var user = 
      { 
        username: toString(data.username),
        email: toString(data.email),
        password: toString(data.password),
        createDate: new Date()
      };
      users.insertUser(user, callback(function (user) {
        delete user.password;
        fn(user);
      }));
    }
  }
  
  function sioInsertThought(data, fn) {
    if (data.title && data.content) {
      var thought = 
      {
        title: toString(data.title),
        content: toString(data.content),
        userId: user._id.toString(),
        createDate: new Date()
      };
      thoughts.insertThought(thought, callback(fn));
    }
  }
  
  function sioGetThought(data, fn) {
    var thoughtId = toString(data._id || data.thoughtId);
    thoughts.getThought(thoughtId, callback(fn));
  }
  
  function sioGetThoughts(data, fn) {
    var query = { userId: user._id.toString() };
    var options = { sort: { 'createDate': -1 }, limit: 20 };
    thoughts.getThoughts(query, options, callback(fn));
  }
  
  function sioGetLinks(data, fn) {
    links.getLinks({ fromId: toString(data.thoughtId || data._id || data.fromId) }, callback(fn));
  }
  
  function sioInsertLink(data, fn) {
    links.insertLink(toString(data.fromId), toString(data.toId), callback(fn));
  }
  
  socket.on('getlatestthought', sioGetLatestThought);
  socket.on('getuser', sioGetUser);
  socket.on('getusers', sioGetUsers);
  socket.on('getthoughts', sioGetThoughts);
  socket.on('getthought', sioGetThought);
  socket.on('insertuser', sioInsertUser);
  socket.on('insertthought', sioInsertThought);
  socket.on('getlinks', sioGetLinks);
  socket.on('insertlink', sioInsertLink);
}

exports.setup = setup;

