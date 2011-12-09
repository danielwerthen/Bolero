function barrier(count, cb) {
  var args = [];
  if (typeof count === 'function') {
    cb = count;
    count = undefined;
  }
  if (count) {
    return function (err, item) {
      if (args.length >= count)
        return;
      if (err)
        cb(err);
      else if (!item)
        cb(null, args);
      else {
        args.push(item);
        if (args.length >= count)
          cb(null, args);
      }
    };
  }
  else {
    return function (err, item) {
      if (err)
        cb(err);
      else if (!item)
        cb(null, args);
      else {
        args.push(item);
      }
    };
  }
}
module.exports = barrier;