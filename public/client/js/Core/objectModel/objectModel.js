/*
var objectModel = (function(){
		var _privateObjectModel = {
			channels: {},
			subscribe : function(channel, fn){
				if (!this.channels[channel]) this.channels[channel] = [];
				this.channels[channel].push({ context: this, callback: fn });
			},
		 
			publish : function(channel){
				if (!_privateCoreMediator.channels[channel]) return false;
				var args = Array.prototype.slice.call(arguments, 1);
				for (var i = 0, l = _privateCoreMediator.channels[channel].length; i < l; i++) {
					var subscription = _privateCoreMediator.channels[channel][i];
					subscription.callback.apply(subscription.context, args);
				}
			}
		};
	 
		return {
			 subscribe: function(args) {
				return _privateCoreMediator.subscribe(args.channel,args.callback);
			},

			publish: function() {
				return _privateCoreMediator.publish(arguments[0].channel,arguments[0]);
			 }		
		}
	}());*/

	
var objectModel = {
	users : Array(),
	thoughts: Array(),
	linkings : Array(),
	linkingTypes : Array()	
	 
};



var user = {
	messages:{
		add:"user.add",
		remove:"user.remove",
		create:"user.create",
		update:"user.update"}
	};

var thought = {
	messages:{
		add:"thought.add",
		remove:"thougth.remove",
		create:"thougth.create",
		update:"thougth.update"}
	};
	
var link = {
	messages:{
		add:"link.add",
		remove:"link.remove",
		create:"link.create",
		update:"link.update"}
	};

var linkType = {
	messages:{
		add:"linkType.add",
		remove:"linkType.remove",
		create:"linkType.create",
		update:"linkType.update"}
	};
	/*
	newUser: function(){ 
		return {   
			_id : {   $oid : null   },   
			id : null,   
			email : null, 
			firstname:null, 
			lastname:null
		};
	},
	newThought: function(){ 
		return{   
			_id : {   $oid : null   },   
			id : null,   
			user : {id:null}, 
			title:null, 
			content:null,
			created:'0001-01-01 00:00:00'
		};
	},
	newLinking: function(){ 
		return {  
			_id : {   $oid : null   },   
			id : null,   
			user : {id:null}, 
			linkingType: {id:null}, 
			fromObject: {id:null}, 
			toObject: {id:null}, 
			created:'0001-01-01 00:00:00'
		};
	},
	newLinkingType:function(){ 
		return {
			_id : {   $oid : null  },   
			id : null, 
			name:null
		};
	}

	*/
	
	
	
	
	
	
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

		thoughtObjectToAdd.user = getUser(thoughtObjectToAdd.user.id)
		thoughtObjectToAdd.linkings = getLinkingsForFromObject(thoughtObjectToAdd.id);
		objectModel.thoughts.push(thoughtObjectToAdd);
	}
	function getThought(id)
	{
		return findById(objectModel.thoughts, id);
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
