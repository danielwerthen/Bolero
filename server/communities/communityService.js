var dbio = require('../../dbio-v3.js');

function insertCommunity(name, userId, description, cb, _id) {
    if (name && userId) {
      var community = { 
        name: name, 
        creatorId: userId,
        description: description || "",
        userIds: [ userId ],
        createDate: new Date(),
        version: 0
      };
      
      if (_id)
        community._id = _id;
      dbio
        .open()
        .collection('communities')
        .insert(community)
        .seq(function (community) {
          cb(null, community);
          this(null);
        })
        .catch(function (err) {
          cb(err);
          this(null);
        })
        .close();
    }
}

function addUser(userId, communityId, cb) {
  if (userId && communityId) {
    var upd = { $addToSet: { userIds: userId }, $inc: { version: 1 } },
        query = { _id: communityId };
    dbio
      .open()
      .collection('communities')
      .findAndModify(query, null, upd, null)
      .seq(function (community) {
        cb(null, community);
        this(null);
      })
      .catch(function (err) {
        cb(err);
        this(null);
      })
      .close();
  }
}

function updateCommunity(data, communityId, cb) {
  if (communityId && (data.name || data.description)) {
    var upd = { $set: {}, $inc: { version: 1 } },
        query = { _id: communityId };
    if (data.name)
      upd.$set.name = data.name;
    if (data.description)
      upd.$set.description = data.description;
    dbio
      .open()
      .collection('communities')
      .findAndModify(query, null, upd, null)
      .seq(function (community) {
        cb(null, community);
        this(null);
      })
      .catch(function (err) {
        cb(err);
        this(null);
      })
      .close();
  }
}

function getCommunity(id, cb) {
  dbio
    .open()
    .collection('communities')
    .findOne({_id: id })
    .seq(function (community) {
      cb(null, community);
      this(null);
    })
    .catch(function (err) {
      cb(err);
      this(null);
    })
    .close();
}

exports.updateCommunity = updateCommunity;
exports.getCommunity = getCommunity;
exports.insertCommunity = insertCommunity;
exports.addUser = addUser;