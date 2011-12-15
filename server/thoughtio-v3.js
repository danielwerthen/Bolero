var dbio = require('../dbio-v3.js');
var logger = require('../utils/logger');
var users = require('../server/users/userService.js');
var thoughts = require('../server/thoughts/thoughtService.js');

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
    var userId = toString(data._id);
    thoughts.getLatestThought(userId, callback(fn));
  }
  
  function sioGetUser(data, fn) {
    var userId = toString(data._id);
    users.getUser(userId, callback(fn));
  }
  
  function sioGetUsers(data, fn) {
    users.getUsers(callback(fn));
  }
  
  socket.on('getLatestThought', sioGetLatestThought);
  socket.on('getUser', sioGetUser);
  socket.on('getUsers', sioGetUsers);
  
  /*
  ioHandler(socket, 'getthoughts', getThoughts);
  ioHandler(socket, 'sendthoughts', sendThoughts);
  ioHandler(socket, 'insertthought', insertThought);
  ioHandler(socket, 'getlinks', getLinks);
  ioHandler(socket, 'insertlink', insertLink);*/
}

exports.setup = setup;

