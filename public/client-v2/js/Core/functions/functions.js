function create(type, id)
{
	if(typeof id != 'undefined')
	{
		return $(document.createElement(type)).attr("id",id);
	}
	else
	{
		return $(document.createElement(type));
	}
	
}

//note: this is not a "real guid" because of the random-function get random values from localmachine
function newGuid() {
			var S4 = function() {
		   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			};
			return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		}
		
function findById(source, id) {
	return findByProperty(source,"id", id);
}

function findByProperty(source,property, id) {
  for (var i = 0; i < source.length; i++) {
    if (source[i][property] === id) {
      return source[i];
    }
  }
  //throw "Couldn't find object with "+property+": " + id;
}

function findByObjectsPropertyId(source,property, id) {

var objects =  Array();

  for (var i = 0; i < source.length; i++) {
    if (source[i][property].id === id) {
      objects.push(source[i]);
    }
  }
  return objects;
}