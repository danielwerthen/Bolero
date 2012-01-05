
function isArray(a)
{
	return Object.prototype.toString.apply(a) === '[object Array]';
}

exports.isArray = isArray;
exports.ObjectId = require('mongodb/lib/mongodb/bson/bson').ObjectID;
