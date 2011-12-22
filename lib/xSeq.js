var Seq = require('Seq'),
		barrier = require('./barrier');


function xSeq(onClose, vars) {
  s = Seq()
  	.seq(function() {
  		for(var p in vars)
  			this.vars[p] = vars[p];
  		this(null);
  	});
  var paths = 0;
  var closePath;
  var passedArgs = [];

  var _onClose = function (err, args) {
    paths--;
    if (closePath) //Use the current barrier to cleanly finish off all the paths
      closePath(err, args);
    else { //This means we have not reached the join statement in this path, so hold the arguments in memory
      if (typeof args === 'array') {
        for (var i in args) {
          passedArgs.push(args[i]);
        }
      }
      else
        passedArgs.push(args);
    }
  }

  //This method creates another Seq path which is will be fed back into this path with Join
  s.split = function (cb) {
    s.seq(function () {
      var args = Array.prototype.slice.call(arguments, 0),
          path = xSeq(_onClose, this.vars),
          main = this;
      
      args.splice(0,0,null); //insert the exception arg
      path
        .seq(function () {
          this.apply(this, args);
        });
      cb(path);
      paths++; //Remember how many paths there currently is, having added one
      main.apply(main, args);
    });
    return s;
  };
  
  //Wait for the splitted paths to complete and feed them into the Seq or pass to parent
  s.join = function () {
    s.seq(function () {
      var self = this;
      var args = Array.prototype.slice.call(arguments, 0);
      for (var i = passedArgs.length; i > 0; i--) {
        args.splice(0, 0, passedArgs[i - 1]);
      }
      if (paths > 0) { //We need to wait for a couple of paths
        closePath = barrier(paths, function (err, result) {
          //This will run when ALL child paths have finished doing their business
          if (typeof result !== 'array')
            result = [result];
          for (var i = args.length; i > 0; i--) {
            result.splice(0,0, args[i - 1]);
          }
          if (result.length === 1)
            result = result[0];
          if (onClose) {
            onClose(err, result); //Call parent to close
          }
          else {
            self(err, result); //Feed args into Seq and continue
          }
        })
      }
      else if (onClose) { //With no open child paths it is safe to continue to parent path
        if (args.length === 1)
          args = args[0];
        onClose(null, args);
      }
      else { //Without any childs or parent paths it is safe to continue with Seq 
        if (args.length === 1)
          args = args[0];
        self(null, args);
      }
    });
  	return s;
	};

  return s;
};

module.exports = function () {
	return xSeq();
}