var             objectModel = {
                users : [],
                thoughts: [],
	            linkings : [],
	            linkingTypes : []	
            };

var messages = {
    user : {
		add:"user.add",
        get:"user.get",
		remove:"user.remove",
		create:"user.create",
		update:"user.update"
	},

    thought : {
		add:"thought.add",
        get:"thought.get",
		remove:"thougth.remove",
		create:"thougth.create",
		update:"thougth.update"
	},
	
    link : {
		add:"link.add",
        get:"link.get",
		remove:"link.remove",
		create:"link.create",
		update:"link.update"
	},
    linkType : {
		add:"linkType.add",
        get:"linkType.get",
		remove:"linkType.remove",
		create:"linkType.create",
		update:"linkType.update"
	}
    };

	
//Users
	function addUser(userObjectToAdd)
	{
		objectModel.users.push(userObjectToAdd);
	}
	function getUser(id)
	{
		return findById(objectModel.users, id);
	}

//Thoughts
	function addThought(thoughtObjectToAdd)
	{

	//	thoughtObjectToAdd.user = getUser(thoughtObjectToAdd.user.id)
	//	thoughtObjectToAdd.linkings = getLinkingsForFromObject(thoughtObjectToAdd.id);
//		objectModel.thoughts.push(thoughtObjectToAdd);
        objectModel.thoughts[thoughtObjectToAdd._id] = thoughtObjectToAdd;
	}
	function getThought(id)
	{
        var thought = objectModel.thoughts[id];
		//return findById(objectModel.thoughts, id);
        return thought;
	}

//Linkings
	function addLinking(linkingObjectToAdd)
	{
	linkingObjectToAdd.linkingType = getLinkingType(linkingObjectToAdd.linkingType.id);
		objectModel.linkings.push(linkingObjectToAdd);
	}
	function getLinking(id)
	{
		return findById(objectModel.linkings, id);
	}
	function getLinkingsForFromObject(id)
	{
		return findByObjectsPropertyId(objectModel.linkings,"fromObject", id);
	}

	
//LinkingTypes
	function addLinkingType(linkingTypeObjectToAdd)
	{
		objectModel.linkingTypes.push(linkingTypeObjectToAdd);
	}
	function getLinkingType(id)
	{
		return findById(objectModel.linkingTypes, id);
	}
