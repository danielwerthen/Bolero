var dbio = require('../../dbio-v3.js');

function getLinks(query, cb) {
  dbio
    .open()
    .collection('links')
    .find(query)
    .toArray()
    .seq(function (links) {
      cb(null, links);
      this(null);
    })
    .catch(function (err) {
      cb(err);
    })
    .close();
}

function insertLink(from, to, cb) {
  var link = { fromId: from, toId: to, createDate: new Date() };
  dbio
    .open()
    .collection('links')
    .insert(link)
    .seq(function (l) {
      cb(null, l);
      this(null);
    })
    .catch(function (err) {
      cb(err);
    })
    .close();
}

exports.getLinks = getLinks;
exports.insertLink = insertLink;