var com = require('../../server/communities/communityService');
var dbio = require('../../dbio-v3.js');

/*
dbio  
  .open()
  .collection('communities')
  .seq(function (collection) {
    collection.findAndModify({_id: 'test'}, [['_id','asc']], {$set: {name: 'name2'}}, {'new':true},
                    function(err, object) {
      if (err) console.warn(err.message);
      else console.dir(object);  // undefined if no matching object exists.
    });
  })
  .close();
  */
  
dbio
  .open()
  .collection('communities')
  .remove({ _id: 'test' })
  .close()
  .seq(function () {
    com.insertCommunity('TestName', 'firstUser', 'description', function (err, ic) {
      
      
      console.log('step 1');
      com.getCommunity(ic[0]._id, function (err, gc) {
        console.log('step 2');
        com.updateCommunity({ name: 'New Title' }, gc._id, function (err, uc1) {
          console.log('step 3: community updated to version ' + uc1.version);
          com.addUser('secondUser', uc1._id, function (err, uc2) {
            console.log('step 4: added user, totalt count: ' + uc2.userIds.length + ' namely: ' + uc2.userIds[0] + ', ' + uc2.userIds[1]);
            com.getCommunity(uc2._id, function (err, f) {
              console.log('step 5: got final community back, version: ' + f.version);
              console.dir(f);
            });
          });
        });
      });
    }, 'test');
  });